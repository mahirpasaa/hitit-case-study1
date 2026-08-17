import React, { createContext, useContext, useMemo, useState } from 'react';
import { AppointmentRequest, Exercise, Notification, Patient } from '../data/types';
import { seedAppointments, seedExercises, seedNotifications, seedPatients } from '../data/seed';

type Session = { role: 'patient' | 'admin'; patientId?: string } | null;

type AppState = {
  session: Session;
  patients: Patient[];
  exercises: Exercise[];
  appointments: AppointmentRequest[];
  notifications: Notification[];

  currentPatient: Patient | null;

  signUp: (name: string, phone: string) => void;
  loginAsPatient: (id: string) => void;
  loginAsAdmin: () => void;
  logout: () => void;

  approvePatient: (id: string) => void;
  rejectPatient: (id: string) => void;
  deletePatient: (id: string) => void;

  toggleExercise: (id: string) => void;

  submitAppointmentRequest: (reason: string, days: string[], timeOfDay: string) => void;
  offerSlots: (requestId: string, slots: string[]) => void;
  chooseSlot: (requestId: string, slot: string) => void;
};

const Ctx = createContext<AppState | null>(null);

let idCounter = 100;
const nextId = (prefix: string) => `${prefix}-${idCounter++}`;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [patients, setPatients] = useState<Patient[]>(seedPatients);
  const [exercises, setExercises] = useState<Exercise[]>(seedExercises);
  const [appointments, setAppointments] = useState<AppointmentRequest[]>(seedAppointments);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);

  const currentPatient = useMemo(
    () => (session?.role === 'patient' ? patients.find((p) => p.id === session.patientId) ?? null : null),
    [session, patients]
  );

  const value: AppState = {
    session,
    patients,
    exercises,
    appointments,
    notifications,
    currentPatient,

    signUp: (name, phone) => {
      const id = nextId('p');
      const newPatient: Patient = {
        id,
        name,
        phone,
        status: 'pending',
        createdAt: 'bugün',
        lastActivity: '—',
        streak: 0,
      };
      setPatients((prev) => [newPatient, ...prev]);
      setSession({ role: 'patient', patientId: id });
    },
    loginAsPatient: (id) => setSession({ role: 'patient', patientId: id }),
    loginAsAdmin: () => setSession({ role: 'admin' }),
    logout: () => setSession(null),

    approvePatient: (id) =>
      setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'active' } : p))),
    rejectPatient: (id) => setPatients((prev) => prev.filter((p) => p.id !== id)),
    deletePatient: (id) => {
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setExercises((prev) => prev.filter((e) => e.patientId !== id));
      setAppointments((prev) => prev.filter((a) => a.patientId !== id));
      setNotifications((prev) => prev.filter((n) => n.patientId !== id));
    },

    toggleExercise: (id) =>
      setExercises((prev) => prev.map((e) => (e.id === id ? { ...e, done: !e.done } : e))),

    submitAppointmentRequest: (reason, days, timeOfDay) => {
      if (!session || session.role !== 'patient' || !session.patientId) return;
      const req: AppointmentRequest = {
        id: nextId('a'),
        patientId: session.patientId,
        reason,
        preferredDays: days,
        preferredTime: timeOfDay,
        status: 'pending',
        offeredSlots: [],
        createdAt: 'bugün',
      };
      setAppointments((prev) => [req, ...prev]);
    },

    offerSlots: (requestId, slots) => {
      setAppointments((prev) =>
        prev.map((a) => (a.id === requestId ? { ...a, status: 'offered', offeredSlots: slots } : a))
      );
      const req = appointments.find((a) => a.id === requestId);
      if (req) {
        setNotifications((prev) => [
          {
            id: nextId('n'),
            patientId: req.patientId,
            kind: 'slotOffer',
            title: 'Randevu Saat Önerisi',
            body: 'Klinik senin için 3 saat önerdi, birini seç:',
            time: 'şimdi',
            slots,
            requestId,
          },
          ...prev,
        ]);
      }
    },

    chooseSlot: (requestId, slot) =>
      setAppointments((prev) =>
        prev.map((a) => (a.id === requestId ? { ...a, status: 'confirmed', confirmedSlot: slot } : a))
      ),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
