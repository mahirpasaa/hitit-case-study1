import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Screen } from '../../components/Screen';
import { Avatar, Button, Chip } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { useAppState } from '../../context/AppState';
import { Patient } from '../../data/types';

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export function PatientsScreen() {
  const { patients, deletePatient } = useAppState();
  const [target, setTarget] = useState<Patient | null>(null);
  const list = patients.filter((p) => p.status !== 'pending');

  return (
    <Screen>
      <Text style={styles.title}>Hastalar</Text>
      <View style={styles.searchBar}>
        <Icon name="search" size={15} color={colors.paperDim} />
        <Text style={styles.searchText}>Hasta ara&hellip;</Text>
      </View>

      <View>
        {list.map((p) => (
          <View key={p.id} style={styles.row}>
            <Avatar initials={initials(p.name)} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{p.name}</Text>
              <Text style={styles.sub}>
                {p.status === 'expired' ? `Üyelik bitti: ${p.lastActivity}` : `Son aktivite: ${p.lastActivity}`}
              </Text>
            </View>
            {p.status === 'expired' ? (
              <Pressable style={styles.deleteBtn} onPress={() => setTarget(p)}>
                <Icon name="trash" size={13} color={colors.red} />
              </Pressable>
            ) : (
              <Chip tone="active">Aktif</Chip>
            )}
          </View>
        ))}
      </View>

      <Modal visible={!!target} transparent animationType="fade" onRequestClose={() => setTarget(null)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.warnIcon}>
              <Icon name="warn" size={18} color={colors.red} />
            </View>
            <Text style={styles.modalTitle}>Hesabı sil &mdash; {target?.name}</Text>
            <Text style={styles.modalBody}>
              Üyeliği sona eren hastanın hesabını silmek üzeresin. Egzersiz geçmişi ve randevu kayıtları kalıcı
              olarak kaldırılır, bu işlem geri alınamaz.
            </Text>
            <View style={styles.modalRow}>
              <Button title="Vazgeç" variant="ghost" style={{ flex: 1 }} onPress={() => setTarget(null)} />
              <Button
                title="Hesabı Sil"
                variant="danger"
                icon={<Icon name="trash" size={14} color={colors.red} />}
                style={{ flex: 1 }}
                onPress={() => {
                  if (target) deletePatient(target.id);
                  setTarget(null);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 20, color: colors.white, marginTop: 6 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(159,178,219,0.06)', borderWidth: 1, borderColor: colors.line,
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12,
  },
  searchText: { fontSize: 13, color: colors.paperDim },
  row: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: 'rgba(159,178,219,0.09)' },
  name: { fontSize: 13.5, fontWeight: '700', color: colors.white },
  sub: { fontSize: 11.5, color: colors.paperDim, marginTop: 1 },
  deleteBtn: {
    width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(224,100,92,0.1)', borderWidth: 1, borderColor: 'rgba(224,100,92,0.35)',
  },
  overlay: { flex: 1, backgroundColor: 'rgba(5,7,15,0.72)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { width: '100%', backgroundColor: colors.navy800, borderWidth: 1, borderColor: colors.line, borderRadius: 18, padding: 18 },
  warnIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(224,100,92,0.16)', alignItems: 'center', justifyContent: 'center', marginBottom: 11 },
  modalTitle: { fontSize: 15, fontWeight: '700', color: colors.white, marginBottom: 7 },
  modalBody: { fontSize: 12.5, lineHeight: 19, color: colors.paperDim, marginBottom: 16 },
  modalRow: { flexDirection: 'row', gap: 9 },
});
