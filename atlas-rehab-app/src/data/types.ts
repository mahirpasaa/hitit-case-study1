export type UserRole = 'patient' | 'admin';
export type PatientStatus = 'pending' | 'active' | 'expired';

export type Patient = {
  id: string;
  name: string;
  phone: string;
  status: PatientStatus;
  createdAt: string;
  lastActivity: string;
  streak: number;
};

export type Exercise = {
  id: string;
  patientId: string;
  name: string;
  sets: number;
  reps: number;
  holdSeconds: number;
  therapistNote: string;
  durationLabel: string;
  done: boolean;
};

export type AppointmentStatus = 'pending' | 'offered' | 'confirmed';

export type AppointmentRequest = {
  id: string;
  patientId: string;
  reason: string;
  preferredDays: string[];
  preferredTime: string;
  status: AppointmentStatus;
  offeredSlots: string[];
  confirmedSlot?: string;
  createdAt: string;
};

export type NotificationKind = 'reminder' | 'slotOffer' | 'approved' | 'streak';

export type Notification = {
  id: string;
  patientId: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  slots?: string[];
  requestId?: string;
};
