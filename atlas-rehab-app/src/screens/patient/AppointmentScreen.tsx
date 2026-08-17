import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/Screen';
import { Button, Card, Note, Pick, SectionLabel, Chip } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { useAppState } from '../../context/AppState';

const REASONS = ['Kontrol', 'Manuel Terapi', 'Schroth'];
const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'];
const TIMES = ['Sabah', 'Öğlen', 'Akşam'];

export function AppointmentScreen() {
  const { currentPatient, appointments, submitAppointmentRequest, chooseSlot } = useAppState();
  const [reason, setReason] = useState(REASONS[0]);
  const [days, setDays] = useState<string[]>(['Sal', 'Çar']);
  const [time, setTime] = useState(TIMES[1]);

  const toggleDay = (d: string) => setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const myRequests = appointments.filter((a) => a.patientId === currentPatient?.id);

  return (
    <Screen>
      <Text style={styles.title}>Randevu Talebi</Text>

      <Card style={{ gap: 14 }}>
        <View style={{ gap: 8 }}>
          <SectionLabel>Talep Nedeni</SectionLabel>
          <View style={styles.row}>
            {REASONS.map((r) => (
              <Pick key={r} label={r} on={reason === r} onPress={() => setReason(r)} />
            ))}
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <SectionLabel>Tercih Ettiğin Günler</SectionLabel>
          <View style={styles.row}>
            {DAYS.map((d) => (
              <Pick key={d} label={d} on={days.includes(d)} onPress={() => toggleDay(d)} />
            ))}
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <SectionLabel>Gün İçi Tercih</SectionLabel>
          <View style={styles.row}>
            {TIMES.map((t) => (
              <Pick key={t} label={t} on={time === t} onPress={() => setTime(t)} />
            ))}
          </View>
        </View>
        <Note>
          Açık saatleri <Text style={{ color: colors.paper, fontWeight: '700' }}>klinik ekibimiz</Text> senin için
          kontrol eder ve sana <Text style={{ color: colors.paper, fontWeight: '700' }}>2-3 saat</Text> önerisi
          gönderir.
        </Note>
        <Button
          title="Talebi Gönder"
          onPress={() => submitAppointmentRequest(reason, days, time)}
          disabled={days.length === 0}
        />
      </Card>

      {myRequests.length > 0 && (
        <View style={{ gap: 10 }}>
          <SectionLabel>Geçmiş Talepler</SectionLabel>
          {myRequests.map((r) => (
            <Card key={r.id} flat style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.reqTitle}>{r.reason}</Text>
                <Chip tone={r.status === 'confirmed' ? 'active' : r.status === 'offered' ? 'info' : 'pending'}>
                  {r.status === 'confirmed' ? 'ONAYLANDI' : r.status === 'offered' ? '3 SAAT ÖNERİSİ GELDİ' : 'İNCELENİYOR'}
                </Chip>
              </View>
              {r.status === 'offered' && (
                <View style={styles.slotRow}>
                  {r.offeredSlots.map((s) => (
                    <Pick key={s} label={s} on={r.confirmedSlot === s} onPress={() => chooseSlot(r.id, s)} />
                  ))}
                </View>
              )}
              {r.status === 'confirmed' && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  <Icon name="calendar" size={14} color={colors.green} />
                  <Text style={styles.confirmedText}>{r.confirmedSlot}</Text>
                </View>
              )}
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 20, color: colors.white, marginTop: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  reqTitle: { fontSize: 13.5, fontWeight: '700', color: colors.white },
  slotRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  confirmedText: { fontSize: 12.5, fontWeight: '700', color: colors.green },
});
