import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/Screen';
import { Pick, SectionLabel } from '../../components/ui';
import { Icon, IconName } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { useAppState } from '../../context/AppState';
import { NotificationKind } from '../../data/types';

const ICONS: Record<NotificationKind, { name: IconName; tone: string }> = {
  reminder: { name: 'bell', tone: 'rgba(111,168,255,0.16)' },
  slotOffer: { name: 'calendar', tone: 'rgba(111,168,255,0.16)' },
  approved: { name: 'check', tone: 'rgba(79,183,131,0.16)' },
  streak: { name: 'flame', tone: 'rgba(224,168,60,0.16)' },
};

export function NotificationsScreen() {
  const { currentPatient, notifications, appointments, chooseSlot } = useAppState();
  const mine = notifications.filter((n) => n.patientId === currentPatient?.id);

  return (
    <Screen>
      <Text style={styles.title}>Bildirimler</Text>
      <View style={{ gap: 4 }}>
        {mine.map((n) => {
          const meta = ICONS[n.kind];
          const req = n.requestId ? appointments.find((a) => a.id === n.requestId) : undefined;
          return (
            <View key={n.id} style={styles.item}>
              <View style={[styles.icon, { backgroundColor: meta.tone }]}>
                <Icon name={meta.name} size={15} color={n.kind === 'streak' ? colors.amber : n.kind === 'approved' ? colors.green : colors.ice300} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.itemTitle}>{n.title}</Text>
                  <Text style={styles.time}>{n.time}</Text>
                </View>
                <Text style={styles.itemBody}>{n.body}</Text>
                {n.slots && req && (
                  <View style={styles.slotRow}>
                    {n.slots.map((s) => (
                      <Pick key={s} label={s} on={req.confirmedSlot === s} onPress={() => chooseSlot(req.id, s)} />
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        })}
        {mine.length === 0 && <Text style={styles.empty}>Henüz bildirimin yok.</Text>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 20, color: colors.white, marginTop: 6, marginBottom: 4 },
  item: { flexDirection: 'row', gap: 11, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(159,178,219,0.09)' },
  icon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 13, fontWeight: '700', color: colors.white, flexShrink: 1 },
  itemBody: { fontSize: 12, color: colors.paperDim, marginTop: 2, lineHeight: 17 },
  time: { fontSize: 10.5, color: colors.paperDim },
  slotRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  empty: { fontSize: 12.5, color: colors.paperDim, textAlign: 'center', paddingTop: 20 },
});
