import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Avatar, Button, Card, Note, Pick, SectionLabel } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { useAppState } from '../../context/AppState';

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

const WEEK = [
  { d: 'Pzt', n: 11, open: false },
  { d: 'Sal', n: 12, open: true },
  { d: 'Çar', n: 13, open: true },
  { d: 'Per', n: 14, open: false },
  { d: 'Cum', n: 15, open: true },
];

const OPEN_SLOTS = ['Sal 14:00', 'Çar 10:30', 'Çar 15:00', 'Cum 16:00', 'Cum 09:30'];

export function SlotOfferScreen() {
  const { params } = useRoute<any>();
  const navigation = useNavigation<any>();
  const { appointments, patients, offerSlots } = useAppState();
  const request = appointments.find((a) => a.id === params.id);
  const patient = patients.find((p) => p.id === request?.patientId);
  const [selected, setSelected] = useState<string[]>(request?.offeredSlots.slice(0, 3) ?? ['Sal 14:00', 'Çar 10:30', 'Cum 16:00']);

  if (!request || !patient) return null;

  const toggle = (slot: string) => {
    setSelected((prev) => {
      if (prev.includes(slot)) return prev.filter((s) => s !== slot);
      if (prev.length >= 3) return prev;
      return [...prev, slot];
    });
  };

  return (
    <Screen>
      <View style={styles.appbar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Icon name="chevronLeft" size={20} color={colors.paperDim} strokeWidth={2} />
        </Pressable>
        <Text style={styles.appbarTitle}>{patient.name}</Text>
      </View>

      <Card flat style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Avatar initials={initials(patient.name)} />
        <View>
          <Text style={styles.reqTitle}>{request.reason} talebi</Text>
          <Text style={styles.reqSub}>
            Tercih: {request.preferredDays.join(' / ')} &middot; {request.preferredTime}
          </Text>
        </View>
      </Card>

      <SectionLabel>Boş Saatler &middot; Bu Hafta</SectionLabel>
      <View style={styles.weekStrip}>
        {WEEK.map((w) => (
          <View key={w.d} style={[styles.weekDay, w.open && styles.weekDayOpen]}>
            <Text style={[styles.weekD, w.open && styles.weekDaySel]}>{w.d}</Text>
            <Text style={[styles.weekN, w.open && styles.weekDaySel]}>{w.n}</Text>
            {w.open && <View style={styles.dot} />}
          </View>
        ))}
      </View>

      <SectionLabel>Teklif Edilecek Saatler &middot; {selected.length}/3</SectionLabel>
      <View style={styles.row}>
        {OPEN_SLOTS.map((s) => (
          <Pick key={s} label={s} on={selected.includes(s)} onPress={() => toggle(s)} />
        ))}
      </View>

      <View style={{ flex: 1 }} />

      <Note>
        Bu saatler yalnızca <Text style={{ color: colors.paper, fontWeight: '700' }}>sana</Text> görünür. Hasta
        yalnızca gönderdiğin {selected.length || 3} seçeneği görecek.
      </Note>
      <Button
        title={`${selected.length} Saati Hastaya Gönder`}
        icon={<Icon name="calendar" size={15} color={colors.navy950} />}
        disabled={selected.length === 0}
        onPress={() => {
          offerSlots(request.id, selected);
          navigation.goBack();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  appbar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  back: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  appbarTitle: { fontSize: 16.5, fontWeight: '700', color: colors.white },
  reqTitle: { fontSize: 13, fontWeight: '700', color: colors.white },
  reqSub: { fontSize: 11, color: colors.paperDim, marginTop: 2 },
  weekStrip: { flexDirection: 'row', gap: 5 },
  weekDay: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(159,178,219,0.05)', borderWidth: 1, borderColor: 'rgba(159,178,219,0.09)' },
  weekDayOpen: { backgroundColor: 'rgba(111,168,255,0.12)', borderColor: 'rgba(111,168,255,0.3)' },
  weekD: { fontSize: 10, fontWeight: '700', color: colors.paperDim, textTransform: 'uppercase' },
  weekN: { fontSize: 13, fontWeight: '700', color: colors.white, marginTop: 2 },
  weekDaySel: { color: colors.ice300 },
  dot: { width: 4, height: 4, borderRadius: 999, backgroundColor: colors.ice400, marginTop: 4 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
});
