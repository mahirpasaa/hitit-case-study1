import { AppointmentRequest, Exercise, Notification, Patient } from './types';

export const seedPatients: Patient[] = [
  { id: 'p-elif', name: 'Elif Kaya', phone: '0532 •• 4471', status: 'active', createdAt: '2026-08-10', lastActivity: 'bugün', streak: 7 },
  { id: 'p-mert', name: 'Mert Tan', phone: '0533 •• 8820', status: 'active', createdAt: '2026-08-09', lastActivity: '3 gün önce', streak: 2 },
  { id: 'p-deniz', name: 'Deniz Özkan', phone: '0555 •• 1102', status: 'expired', createdAt: '2026-05-02', lastActivity: '10 Ağu', streak: 0 },
  { id: 'p-selin', name: 'Selin Yıldız', phone: '0541 •• 2290', status: 'active', createdAt: '2026-07-22', lastActivity: 'dün', streak: 4 },
  { id: 'p-burak', name: 'Burak Arslan', phone: '0505 •• 6634', status: 'pending', createdAt: '2026-08-15', lastActivity: '—', streak: 0 },
];

export const seedExercises: Exercise[] = [
  { id: 'e-1', patientId: 'p-elif', name: 'Schroth Nefes Egzersizi', sets: 3, reps: 10, holdSeconds: 0, durationLabel: '01:40', therapistNote: 'Nefesi tutma, hareketi yavaş yap.', done: true },
  { id: 'e-2', patientId: 'p-elif', name: 'Duvarda Uzanma', sets: 3, reps: 12, holdSeconds: 0, durationLabel: '01:55', therapistNote: 'Omuzları gevşet, boyun uzun kalsın.', done: true },
  { id: 'e-3', patientId: 'p-elif', name: 'Pelvis Stabilizasyon', sets: 2, reps: 15, holdSeconds: 30, durationLabel: '02:14', therapistNote: 'Nefesini tutma, hareketi yavaş ve kontrollü yap. Ağrı hissedersen dur.', done: false },
];

export const seedAppointments: AppointmentRequest[] = [
  {
    id: 'a-1',
    patientId: 'p-elif',
    reason: 'Schroth Seansı',
    preferredDays: ['Sal', 'Çar'],
    preferredTime: 'Öğlen',
    status: 'offered',
    offeredSlots: ['Sal 14:00', 'Çar 10:30', 'Cum 16:00'],
    createdAt: '2026-08-14',
  },
];

export const seedNotifications: Notification[] = [
  { id: 'n-1', patientId: 'p-elif', kind: 'reminder', title: 'Egzersiz Hatırlatması', body: 'Bugünün 3 egzersizini tamamlamayı unutma.', time: '09:00' },
  { id: 'n-2', patientId: 'p-elif', kind: 'slotOffer', title: 'Randevu Saat Önerisi', body: 'Klinik senin için 3 saat önerdi, birini seç:', time: 'bugün', slots: ['Sal 14:00', 'Çar 10:30', 'Cum 16:00'], requestId: 'a-1' },
  { id: 'n-3', patientId: 'p-elif', kind: 'approved', title: 'Hesabın Onaylandı', body: "Atlas Rehab'a hoş geldin, Elif!", time: 'Pzt' },
  { id: 'n-4', patientId: 'p-elif', kind: 'streak', title: '7 Gün Seri!', body: 'Egzersiz serini sürdürüyorsun, harika gidiyor.', time: 'Paz' },
];
