# Atlas Rehab — Uygulama İskeleti (MVP)

Atlas Rehab Center için Expo (React Native) ile geliştirilen hasta + admin uygulaması.
Artık gerçek bir **Supabase** backend'ine bağlı: gerçek kayıt/giriş (Auth), Postgres tabloları
ve Row Level Security (RLS) kuralları ile çalışıyor. Mock veri kaldırıldı.

## İçerdiği akışlar

**Hasta:** kayıt (e-posta/şifre) / onay bekliyor → ana sayfa (seri + günlük egzersizler +
yaklaşan randevu) → egzersiz detayı (video/set/tekrar/tamamlama) → randevu talebi (hasta saat
görmez, sadece tercih iletir) → bildirimler (egzersiz hatırlatıcı + admin'in gönderdiği 2-3
saat teklifi, birini seçme).

**Admin:** onay bekleyen hesaplar (onayla/reddet) → randevu talepleri → saat teklif etme (kendi
boş takvimini görür, 2-3 saat seçip hastaya gönderir) → hasta yönetimi (üyeliği biten hastanın
hesabını "geri alınamaz" uyarısıyla silme).

## Kurulum — ilk kez çalıştırıyorsan

**1) Veritabanı şemasını oluştur (bir kereye mahsus)**

Supabase projendeki **SQL Editor**'e git, `supabase/schema.sql` dosyasının tamamını yapıştırıp
**Run**'a bas. Bu, tabloları (`patients`, `exercises`, `appointment_requests`, `notifications`,
`admins`) ve güvenlik kurallarını (RLS) kurar.

**2) Bir admin (klinik yöneticisi) hesabı oluştur**

1. Uygulamadan normal şekilde "Hesap Oluştur" ile bir hesap aç (kendi e-postanla).
2. Supabase Dashboard → **Authentication → Users**'a git, az önce oluşturduğun kullanıcının
   **UUID**'sini kopyala.
3. SQL Editor'de şunu çalıştır (UUID'yi yapıştırarak):
   ```sql
   insert into public.admins (id) values ('BURAYA-UUID-YAPISTIR');
   ```
4. Uygulamada çıkış yapıp tekrar aynı e-posta/şifreyle giriş yap — artık admin panelini
   göreceksin.

**3) Uygulamayı çalıştır**

```bash
git clone <bu repo>
cd atlas-rehab-app
npm install
npx expo start
```

Ardından:
1. Telefonuna **Expo Go** uygulamasını kur (App Store — şu an App Store'daki Expo Go **Expo SDK
   54** ile uyumlu, proje de buna göre sabitlendi).
2. Bilgisayarın ve telefonun **aynı Wi-Fi ağında** olduğundan emin ol.
3. Terminalde çıkan QR kodu iPhone'da **Kamera** ile okut.
4. Uygulama telefonunda canlı açılır; kod değiştikçe anında güncellenir.

## Bilinen sınırlamalar (sıradaki adımlar)

- **Hasta reddetme/silme**: Şu an sadece `patients` tablosundaki kaydı siliyor; kişinin asıl
  giriş hesabını (Supabase Auth kullanıcısını) silmiyor — bunun için `service_role` yetkili bir
  Edge Function gerekiyor (client'a asla `service_role` anahtarı konulmaz).
- **Push bildirimleri**: Şu an bildirimler sadece uygulama içi listede görünüyor, telefona
  push olarak düşmüyor. Sırada: Expo Notifications + bir Supabase Edge Function.
- **Egzersiz videoları**: Henüz gerçek video yükleme/oynatma yok (Supabase Storage ile eklenecek).
- **App Store yayını**: Apple Developer hesabı alındığında `eas build` ile gerçek `.ipa`.
