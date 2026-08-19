-- Atlas Rehab — veritabanı şeması + güvenlik kuralları (RLS)
-- Supabase Dashboard > SQL Editor içine yapıştırıp "Run" ile bir kerede çalıştır.

create extension if not exists pgcrypto;

-- ============================================================
-- TABLOLAR
-- ============================================================

create table public.patients (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text not null,
  status text not null default 'pending' check (status in ('pending','active','expired')),
  streak integer not null default 0,
  last_activity text not null default '—',
  created_at timestamptz not null default now()
);

create table public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  name text not null,
  sets integer not null,
  reps integer not null,
  hold_seconds integer not null default 0,
  duration_label text not null default '',
  therapist_note text not null default '',
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.appointment_requests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  reason text not null,
  preferred_days text[] not null default '{}',
  preferred_time text not null default '',
  status text not null default 'pending' check (status in ('pending','offered','confirmed')),
  offered_slots text[] not null default '{}',
  confirmed_slot text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  kind text not null check (kind in ('reminder','slotOffer','approved','streak')),
  title text not null,
  body text not null,
  slots text[],
  request_id uuid references public.appointment_requests(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- YARDIMCI FONKSİYON: giriş yapan kullanıcı admin mi?
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

-- ============================================================
-- RLS AÇMA
-- ============================================================

alter table public.patients enable row level security;
alter table public.admins enable row level security;
alter table public.exercises enable row level security;
alter table public.appointment_requests enable row level security;
alter table public.notifications enable row level security;

-- ============================================================
-- PATIENTS
-- select: hasta kendi kaydını, admin herkesi görür
-- insert: hasta kayıt olurken kendi satırını oluşturur (status='pending')
-- update: hem hasta hem admin satıra dokunabilir, AMA hangi kolonlara
--         dokunabileceği aşağıdaki trigger ile ayrıştırılıyor (hasta sadece
--         streak/last_activity değiştirebilir, status'u değiştiremez)
-- delete: sadece admin (üyeliği biten hastayı silme)
-- ============================================================

create policy "patients_select" on public.patients
  for select using (auth.uid() = id or public.is_admin());

create policy "patients_insert_self" on public.patients
  for insert with check (auth.uid() = id);

create policy "patients_update" on public.patients
  for update using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

create policy "patients_delete_admin" on public.patients
  for delete using (public.is_admin());

create or replace function public.guard_patients_update()
returns trigger
language plpgsql
security definer
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  -- admin değilse: sadece kendi satırında streak/last_activity değişebilir
  if new.id <> old.id or new.name <> old.name or new.phone <> old.phone
     or new.status <> old.status or new.created_at <> old.created_at then
    raise exception 'Bu alanları değiştirme yetkin yok';
  end if;
  return new;
end;
$$;

create trigger trg_guard_patients_update
  before update on public.patients
  for each row execute function public.guard_patients_update();

-- ============================================================
-- ADMINS — sadece adminler görebilir, kimse ekleyemez (elle eklenir)
-- ============================================================

create policy "admins_select" on public.admins
  for select using (public.is_admin());

-- ============================================================
-- EXERCISES
-- select: hasta kendi egzersizini, admin hepsini görür
-- insert/delete: sadece admin (egzersiz atama/kaldırma)
-- update: hasta sadece "done" alanını değiştirebilir (trigger ile korunur),
--         admin her alanı değiştirebilir
-- ============================================================

create policy "exercises_select" on public.exercises
  for select using (patient_id = auth.uid() or public.is_admin());

create policy "exercises_insert_admin" on public.exercises
  for insert with check (public.is_admin());

create policy "exercises_delete_admin" on public.exercises
  for delete using (public.is_admin());

create policy "exercises_update" on public.exercises
  for update using (patient_id = auth.uid() or public.is_admin())
  with check (patient_id = auth.uid() or public.is_admin());

create or replace function public.guard_exercises_update()
returns trigger
language plpgsql
security definer
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if new.patient_id <> old.patient_id or new.name <> old.name or new.sets <> old.sets
     or new.reps <> old.reps or new.hold_seconds <> old.hold_seconds
     or new.duration_label <> old.duration_label or new.therapist_note <> old.therapist_note then
    raise exception 'Bu alanları değiştirme yetkin yok';
  end if;
  return new;
end;
$$;

create trigger trg_guard_exercises_update
  before update on public.exercises
  for each row execute function public.guard_exercises_update();

-- ============================================================
-- APPOINTMENT REQUESTS
-- select: hasta kendi talebini, admin hepsini görür
-- insert: hasta kendi talebini oluşturur
-- update: hasta sadece offered->confirmed geçişinde confirmed_slot/status
--         değiştirebilir, admin her alanı (özellikle offered_slots) değiştirir
-- ============================================================

create policy "appt_select" on public.appointment_requests
  for select using (patient_id = auth.uid() or public.is_admin());

create policy "appt_insert_self" on public.appointment_requests
  for insert with check (patient_id = auth.uid());

create policy "appt_update" on public.appointment_requests
  for update using (patient_id = auth.uid() or public.is_admin())
  with check (patient_id = auth.uid() or public.is_admin());

create or replace function public.guard_appt_update()
returns trigger
language plpgsql
security definer
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if new.patient_id <> old.patient_id or new.reason <> old.reason
     or new.preferred_days <> old.preferred_days or new.preferred_time <> old.preferred_time
     or new.offered_slots <> old.offered_slots then
    raise exception 'Bu alanları değiştirme yetkin yok';
  end if;
  if old.status <> 'offered' or new.status <> 'confirmed' then
    raise exception 'Sadece teklif edilen bir randevuyu onaylayabilirsin';
  end if;
  if new.confirmed_slot is null or not (new.confirmed_slot = any (old.offered_slots)) then
    raise exception 'Sadece teklif edilen saatlerden birini seçebilirsin';
  end if;
  return new;
end;
$$;

create trigger trg_guard_appt_update
  before update on public.appointment_requests
  for each row execute function public.guard_appt_update();

-- ============================================================
-- NOTIFICATIONS — hasta kendi bildirimini görür, admin ekler
-- ============================================================

create policy "notif_select" on public.notifications
  for select using (patient_id = auth.uid() or public.is_admin());

create policy "notif_insert_admin" on public.notifications
  for insert with check (public.is_admin());

-- ============================================================
-- KURULUM SONRASI: kendini admin yapmak için
-- ============================================================
-- 1) Önce uygulamadan normal şekilde bir hasta hesabı oluştur (Kayıt Ol).
-- 2) Supabase Dashboard > Authentication > Users sayfasından o kullanıcının
--    UUID'sini kopyala.
-- 3) Aşağıdaki satırı UUID'yi yapıştırarak SQL Editor'de çalıştır:
--
-- insert into public.admins (id) values ('BURAYA-KULLANICI-UUID-YAPISTIR');
--
-- Not: Bir kullanıcı hem admins hem patients tablosunda olabilir; uygulama
-- girişte önce admins'e bakar, oradaysa admin paneline yönlendirir.
