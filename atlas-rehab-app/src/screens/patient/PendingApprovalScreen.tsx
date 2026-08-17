import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card, Button, Chip } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { useAppState } from '../../context/AppState';

export function PendingApprovalScreen() {
  const { currentPatient, logout } = useAppState();

  return (
    <Screen>
      <View style={{ alignItems: 'center', paddingTop: 40, gap: 16 }}>
        <View style={styles.iconCircle}>
          <Icon name="clock" size={30} color={colors.amber} />
        </View>
        <Text style={styles.title}>Hesabın İnceleniyor</Text>
        <Chip tone="pending">ONAY BEKLİYOR</Chip>
        <Text style={styles.body}>
          Merhaba {currentPatient?.name ?? ''}, kaydın klinik ekibimize ulaştı. Bilgilerin onaylandığında
          bildirim alacak ve uygulamaya giriş yapabileceksin.
        </Text>

        <Card style={{ width: '100%', gap: 10 }}>
          <Row label="Ad Soyad" value={currentPatient?.name ?? '—'} />
          <Row label="Telefon" value={currentPatient?.phone ?? '—'} />
          <Row label="Başvuru" value={currentPatient?.createdAt ?? '—'} />
        </Card>

        <Button title="Çıkış Yap" variant="ghost" onPress={logout} style={{ width: '100%' }} />
      </View>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 999,
    backgroundColor: 'rgba(224,168,60,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: fonts.display, fontSize: 20, color: colors.white },
  body: { fontSize: 13, color: colors.paperDim, textAlign: 'center', lineHeight: 20, paddingHorizontal: 6 },
  rowLabel: { fontSize: 12.5, color: colors.paperDim, fontWeight: '600' },
  rowValue: { fontSize: 12.5, color: colors.white, fontWeight: '700' },
});
