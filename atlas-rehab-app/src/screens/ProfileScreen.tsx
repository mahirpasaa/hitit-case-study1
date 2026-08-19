import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Button, Card, Chip } from '../components/ui';
import { Icon } from '../components/Icon';
import { colors } from '../theme/colors';
import { useAppState } from '../context/AppState';
import { supabase } from '../lib/supabase';

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { session, currentPatient, patients, logout } = useAppState();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const isAdmin = session?.role === 'admin';
  // Adminler genelde önce hasta olarak kaydolup sonra yükseltildiği için
  // patients tablosunda da bir satırları olabilir — varsa adını oradan al.
  const adminSelfRow = isAdmin ? patients.find((p) => p.id === session?.patientId) : null;
  const name = isAdmin ? adminSelfRow?.name ?? 'Klinik Yöneticisi' : currentPatient?.name ?? '—';

  return (
    <Screen>
      <View style={styles.appbar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Icon name="chevronLeft" size={20} color={colors.paperDim} strokeWidth={2} />
        </Pressable>
        <Text style={styles.appbarTitle}>Profil</Text>
      </View>

      <View style={{ alignItems: 'center', paddingVertical: 8, gap: 10 }}>
        <View style={styles.avatarBig}>
          <Icon name="user" size={30} color={colors.ice300} />
        </View>
        {isAdmin && <Chip tone="info">ADMİN</Chip>}
      </View>

      <Card style={{ gap: 14 }}>
        <Field label="Ad Soyad" value={name} />
        <Divider />
        <Field label="E-posta" value={email ?? undefined} loading={email === null} />
      </Card>

      <View style={{ flex: 1 }} />

      <Button
        title="Çıkış Yap"
        variant="danger"
        icon={<Icon name="x" size={15} color={colors.red} />}
        onPress={logout}
      />
    </Screen>
  );
}

function Field({ label, value, loading }: { label: string; value?: string; loading?: boolean }) {
  return (
    <View style={{ gap: 5 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {loading ? (
        <ActivityIndicator color={colors.paperDim} style={{ alignSelf: 'flex-start' }} />
      ) : (
        <Text style={styles.fieldValue}>{value || '—'}</Text>
      )}
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: 'rgba(159,178,219,0.09)' }} />;
}

const styles = StyleSheet.create({
  appbar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  back: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  appbarTitle: { fontSize: 16.5, fontWeight: '700', color: colors.white },
  avatarBig: {
    width: 68, height: 68, borderRadius: 999,
    backgroundColor: colors.navy700, borderWidth: 1, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  fieldLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase', color: colors.paperDim },
  fieldValue: { fontSize: 14.5, fontWeight: '600', color: colors.white },
});
