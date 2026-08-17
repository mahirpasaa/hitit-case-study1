import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Screen } from '../../components/Screen';
import { Avatar } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { useAppState } from '../../context/AppState';

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export function PendingApprovalsScreen() {
  const { patients, approvePatient, rejectPatient } = useAppState();
  const pending = patients.filter((p) => p.status === 'pending');

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Onay Bekleyenler</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{pending.length}</Text>
        </View>
      </View>
      <View>
        {pending.map((p) => (
          <View key={p.id} style={styles.row}>
            <Avatar initials={initials(p.name)} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{p.name}</Text>
              <Text style={styles.sub}>{p.phone} &middot; {p.createdAt}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable style={[styles.iconBtn, styles.approve]} onPress={() => approvePatient(p.id)}>
                <Icon name="check" size={13} color={colors.green} />
              </Pressable>
              <Pressable style={[styles.iconBtn, styles.reject]} onPress={() => rejectPatient(p.id)}>
                <Icon name="x" size={13} color={colors.red} />
              </Pressable>
            </View>
          </View>
        ))}
        {pending.length === 0 && <Text style={styles.empty}>Onay bekleyen hesap yok.</Text>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  title: { fontFamily: fonts.display, fontSize: 20, color: colors.white },
  countBadge: { backgroundColor: colors.ice400, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  countText: { fontSize: 11.5, fontWeight: '700', color: colors.navy950 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(159,178,219,0.09)' },
  name: { fontSize: 13.5, fontWeight: '700', color: colors.white },
  sub: { fontSize: 11.5, color: colors.paperDim, marginTop: 1 },
  actions: { flexDirection: 'row', gap: 7 },
  iconBtn: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  approve: { backgroundColor: 'rgba(79,183,131,0.1)', borderColor: 'rgba(79,183,131,0.35)' },
  reject: { backgroundColor: 'rgba(224,100,92,0.1)', borderColor: 'rgba(224,100,92,0.35)' },
  empty: { fontSize: 12.5, color: colors.paperDim, textAlign: 'center', paddingTop: 20 },
});
