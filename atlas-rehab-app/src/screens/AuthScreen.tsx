import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Screen } from '../components/Screen';
import { Card, Button, Chip } from '../components/ui';
import { AtlasMark, Icon } from '../components/Icon';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { useAppState } from '../context/AppState';

export function AuthScreen() {
  const { signUp, loginAsPatient, loginAsAdmin, patients } = useAppState();
  const [name, setName] = useState('Elif Kaya');
  const [phone, setPhone] = useState('0532 000 4471');
  const [password, setPassword] = useState('••••••••');

  const activePatient = patients.find((p) => p.status === 'active');
  const pendingPatient = patients.find((p) => p.status === 'pending');

  return (
    <Screen>
      <View style={{ alignItems: 'center', paddingTop: 18, paddingBottom: 6 }}>
        <View style={styles.markCircle}>
          <AtlasMark size={30} color={colors.white} />
        </View>
        <Text style={styles.wordmark}>ATLAS REHAB</Text>
        <Text style={styles.sub}>Omurga Sağlığı &amp; Ortopedik Rehabilitasyon</Text>
      </View>

      <Card style={{ gap: 12 }}>
        <Text style={styles.cardTitle}>Hesap Oluştur</Text>
        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Ad Soyad</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor={colors.paperDim} />
        </View>
        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Telefon</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholderTextColor={colors.paperDim} />
        </View>
        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Şifre</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={colors.paperDim} />
        </View>
        <Button title="Hesap Oluştur" onPress={() => signUp(name.trim() || 'Yeni Hasta', phone.trim())} />
        <View style={styles.noteRow}>
          <Chip tone="pending">ONAY BEKLİYOR</Chip>
        </View>
        <Text style={styles.noteText}>
          Kaydın alındıktan sonra klinik ekibimiz bilgilerini onaylayana kadar hesabın bu durumda kalır.
        </Text>
      </Card>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>DEMO GİRİŞİ</Text>
        <View style={styles.dividerLine} />
      </View>

      <Text style={styles.demoHint}>
        Backend henüz bağlı değil — akışları hızlıca görmek için aşağıdan bir rol seçerek gir.
      </Text>

      <View style={{ gap: 10 }}>
        <DemoRow
          icon="user"
          title="Onaylı hasta olarak gir"
          subtitle={activePatient ? activePatient.name : 'Aktif hasta'}
          onPress={() => activePatient && loginAsPatient(activePatient.id)}
        />
        <DemoRow
          icon="clock"
          title="Onay bekleyen hasta olarak gir"
          subtitle={pendingPatient ? pendingPatient.name : 'Onay bekliyor'}
          onPress={() => pendingPatient && loginAsPatient(pendingPatient.id)}
        />
        <DemoRow icon="clipboard" title="Klinik yöneticisi (admin) olarak gir" subtitle="Onay, randevu ve hasta yönetimi" onPress={loginAsAdmin} />
      </View>
    </Screen>
  );
}

function DemoRow({ icon, title, subtitle, onPress }: { icon: any; title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.demoRow}>
      <View style={styles.demoIcon}>
        <Icon name={icon} size={17} color={colors.ice300} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.demoTitle}>{title}</Text>
        <Text style={styles.demoSub}>{subtitle}</Text>
      </View>
      <View style={{ transform: [{ rotate: '180deg' }] }}>
        <Icon name="chevronLeft" size={16} color={colors.paperDim} strokeWidth={2} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  markCircle: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: colors.navy700,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.line,
  },
  wordmark: { fontFamily: fonts.display, fontSize: 19, color: colors.white, letterSpacing: 0.5 },
  sub: { fontSize: 11.5, color: colors.paperDim, marginTop: 3, textAlign: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.white },
  label: { fontSize: 11.5, fontWeight: '700', color: colors.paperDim },
  input: {
    backgroundColor: 'rgba(159,178,219,0.06)',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 11,
    paddingVertical: 11,
    paddingHorizontal: 12,
    color: colors.white,
    fontSize: 13.5,
  },
  noteRow: { flexDirection: 'row' },
  noteText: { fontSize: 11.5, color: colors.paperDim, lineHeight: 17 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerText: { fontSize: 10.5, fontWeight: '700', letterSpacing: 1.2, color: colors.paperDim },
  demoHint: { fontSize: 11.5, color: colors.paperDim, lineHeight: 17, marginTop: -6 },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 13,
    padding: 12,
    backgroundColor: 'rgba(159,178,219,0.04)',
  },
  demoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(111,168,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoTitle: { fontSize: 13, fontWeight: '700', color: colors.white },
  demoSub: { fontSize: 11.5, color: colors.paperDim, marginTop: 1 },
});
