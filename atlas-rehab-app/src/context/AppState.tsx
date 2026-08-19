import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AppointmentRequest, Exercise, Notification, Patient } from '../data/types';

type Session = { role: 'patient' | 'admin'; patientId?: string } | null;

type AppState = {
  loading: boolean;
  authError: string | null;
  session: Session;
  patients: Patient[];
  exercises: Exercise[];
  appointments: AppointmentRequest[];
  notifications: Notification[];
  currentPatient: Patient | null;

  signUp: (name: string, phone: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  approvePatient: (id: string) => Promise<void>;
  rejectPatient: (id: string) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;

  toggleExercise: (id: string) => Promise<void>;

  submitAppointmentRequest: (reason: string, days: string[], timeOfDay: string) => Promise<void>;
  offerSlots: (requestId: string, slots: string[]) => Promise<void>;
  chooseSlot: (requestId: string, slot: string) => Promise<void>;
};

const Ctx = createContext<AppState | null>(null);

function mapPatient(r: any): Patient {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    status: r.status,
    streak: r.streak,
    lastActivity: r.last_activity,
    createdAt: (r.created_at ?? '').slice(0, 10),
  };
}
function mapExercise(r: any): Exercise {
  return {
    id: r.id,
    patientId: r.patient_id,
    name: r.name,
    sets: r.sets,
    reps: r.reps,
    holdSeconds: r.hold_seconds,
    durationLabel: r.duration_label,
    therapistNote: r.therapist_note,
    done: r.done,
  };
}
function mapAppointment(r: any): AppointmentRequest {
  return {
    id: r.id,
    patientId: r.patient_id,
    reason: r.reason,
    preferredDays: r.preferred_days ?? [],
    preferredTime: r.preferred_time,
    status: r.status,
    offeredSlots: r.offered_slots ?? [],
    confirmedSlot: r.confirmed_slot ?? undefined,
    createdAt: (r.created_at ?? '').slice(0, 10),
  };
}
function mapNotification(r: any): Notification {
  return {
    id: r.id,
    patientId: r.patient_id,
    kind: r.kind,
    title: r.title,
    body: r.body,
    slots: r.slots ?? undefined,
    requestId: r.request_id ?? undefined,
    time: (r.created_at ?? '').slice(11, 16),
  };
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [session, setSession] = useState<Session>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const resolvingRef = useRef(false);

  const currentPatient = useMemo(
    () => (session?.role === 'patient' ? patients.find((p) => p.id === session.patientId) ?? null : null),
    [session, patients]
  );

  async function loadDataFor(nextSession: Session) {
    if (!nextSession) {
      setPatients([]);
      setExercises([]);
      setAppointments([]);
      setNotifications([]);
      return;
    }
    if (nextSession.role === 'admin') {
      const [p, e, a, n] = await Promise.all([
        supabase.from('patients').select('*').order('created_at', { ascending: false }),
        supabase.from('exercises').select('*'),
        supabase.from('appointment_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }),
      ]);
      setPatients((p.data ?? []).map(mapPatient));
      setExercises((e.data ?? []).map(mapExercise));
      setAppointments((a.data ?? []).map(mapAppointment));
      setNotifications((n.data ?? []).map(mapNotification));
    } else {
      const pid = nextSession.patientId!;
      const [p, e, a, n] = await Promise.all([
        supabase.from('patients').select('*').eq('id', pid),
        supabase.from('exercises').select('*').eq('patient_id', pid),
        supabase.from('appointment_requests').select('*').eq('patient_id', pid).order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').eq('patient_id', pid).order('created_at', { ascending: false }),
      ]);
      setPatients((p.data ?? []).map(mapPatient));
      setExercises((e.data ?? []).map(mapExercise));
      setAppointments((a.data ?? []).map(mapAppointment));
      setNotifications((n.data ?? []).map(mapNotification));
    }
  }

  async function resolveSession(userId: string | null) {
    if (resolvingRef.current) return;
    resolvingRef.current = true;
    try {
      if (!userId) {
        setSession(null);
        await loadDataFor(null);
        return;
      }
      const { data: adminRow } = await supabase.from('admins').select('id').eq('id', userId).maybeSingle();
      if (adminRow) {
        const next: Session = { role: 'admin' };
        setSession(next);
        await loadDataFor(next);
        return;
      }
      const { data: patientRow } = await supabase.from('patients').select('id').eq('id', userId).maybeSingle();
      if (patientRow) {
        const next: Session = { role: 'patient', patientId: userId };
        setSession(next);
        await loadDataFor(next);
        return;
      }
      // Kimlik doğrulanmış ama ne admin ne hasta kaydı var (silinmiş/reddedilmiş olabilir)
      setAuthError('Hesabına ait bir kayıt bulunamadı. Klinikle iletişime geç.');
      await supabase.auth.signOut();
      setSession(null);
      await loadDataFor(null);
    } finally {
      resolvingRef.current = false;
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      resolveSession(data.session?.user.id ?? null).finally(() => setLoading(false));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      resolveSession(sess?.user.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function refresh() {
    await loadDataFor(session);
  }

  const value: AppState = {
    loading,
    authError,
    session,
    patients,
    exercises,
    appointments,
    notifications,
    currentPatient,

    signUp: async (name, phone, email, password) => {
      setAuthError(null);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setAuthError(error.message);
        throw error;
      }
      const userId = data.user?.id;
      if (!userId) {
        setAuthError('Hesap oluşturuldu ama e-postanı onaylaman gerekebilir.');
        return;
      }
      const { error: insertErr } = await supabase.from('patients').insert({
        id: userId,
        name,
        phone,
        status: 'pending',
      });
      if (insertErr) {
        setAuthError(insertErr.message);
        throw insertErr;
      }
      await resolveSession(userId);
    },

    signIn: async (email, password) => {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
        throw error;
      }
    },

    logout: async () => {
      await supabase.auth.signOut();
    },

    approvePatient: async (id) => {
      await supabase.from('patients').update({ status: 'active' }).eq('id', id);
      await refresh();
    },
    rejectPatient: async (id) => {
      await supabase.from('patients').delete().eq('id', id);
      await refresh();
    },
    deletePatient: async (id) => {
      await supabase.from('patients').delete().eq('id', id);
      await refresh();
    },

    toggleExercise: async (id) => {
      const ex = exercises.find((e) => e.id === id);
      if (!ex) return;
      await supabase.from('exercises').update({ done: !ex.done }).eq('id', id);
      await refresh();
    },

    submitAppointmentRequest: async (reason, days, timeOfDay) => {
      if (!session || session.role !== 'patient' || !session.patientId) return;
      await supabase.from('appointment_requests').insert({
        patient_id: session.patientId,
        reason,
        preferred_days: days,
        preferred_time: timeOfDay,
      });
      await refresh();
    },

    offerSlots: async (requestId, slots) => {
      const req = appointments.find((a) => a.id === requestId);
      await supabase.from('appointment_requests').update({ status: 'offered', offered_slots: slots }).eq('id', requestId);
      if (req) {
        await supabase.from('notifications').insert({
          patient_id: req.patientId,
          kind: 'slotOffer',
          title: 'Randevu Saat Önerisi',
          body: 'Klinik senin için 3 saat önerdi, birini seç:',
          slots,
          request_id: requestId,
        });
      }
      await refresh();
    },

    chooseSlot: async (requestId, slot) => {
      await supabase.from('appointment_requests').update({ status: 'confirmed', confirmed_slot: slot }).eq('id', requestId);
      await refresh();
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
