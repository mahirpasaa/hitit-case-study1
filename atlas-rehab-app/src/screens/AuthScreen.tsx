import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { Screen } from '../components/Screen';
import { Card, Button, Chip } from '../components/ui';
import { AtlasMark } from '../components/Icon';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { useAppState } from '../context/AppState';

export function AuthScreen() {
  const { signUp, signIn, authError } = useAppState();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const submit = async () => {
    setLocalError(null);
    if (!email.trim() || !password.trim()) {
      setLocalError('E-posta ve şifre zorunlu.');
      return;
    }
    if (mode === 'signup' && (!name.trim() || !phone.trim())) {
      setLocalError('Ad soyad ve telefon zorunlu.');
      return;
    }
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUp(name.trim(), phone.trim(), email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
    } catch (e: any) {
      setLocalError(e?.message ?? 'Bir şeyler ters gitti.');
    } finally {
      setSubmitting(false);
    }
  };

  const errorText = localError ?? authError;

  return (
    <Screen>
      <View style={{ alignItems: 'center', paddingTop: 18, paddingBottom: 6 }}>
        <View style={styles.markCircle}>
          <AtlasMark size={30} color={colors.white} />
        </View>
        <Text style={styles.wordmark}>ATLAS REHAB</Text>
        <Text style={styles.sub}>Omurga Sağlığı &amp; Ortopedik Rehabilitasyon</Text>
      </View>

      <View style={styles.tabRow}>
        <Pressable style={[styles.tab, mode === 'signup' && styles.tabActive]} onPress={() => setMode('signup')}>
          <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>Hesap Oluştur</Text>
        </Pressable>
        <Pressable style={[styles.tab, mode === 'login' && styles.tabActive]} onPress={() => setMode('login')}>
          <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Giriş Yap</Text>
        </Pressable>
      </View>

      <Card style={{ gap: 12 }}>
        {mode === 'signup' && (
          <>
            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Ad Soyad</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Elif Kaya" placeholderTextColor={colors.paperDim} />
            </View>
            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Telefon</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="0532 000 0000" placeholderTextColor={colors.paperDim} keyboardType="phone-pad" />
            </View>
          </>
        )}
        <View style={{ gap: 6 }}>
          <Text style={styles.label}>E-posta</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="ornek@eposta.com"
            placeholderTextColor={colors.paperDim}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Şifre</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="En az 6 karakter"
            placeholderTextColor={colors.paperDim}
            secureTextEntry
          />
        </View>

        {errorText && <Text style={styles.errorText}>{errorText}</Text>}

        <Button
          title={submitting ? '' : mode === 'signup' ? 'Hesap Oluştur' : 'Giriş Yap'}
          onPress={submit}
          disabled={submitting}
          icon={submitting ? <ActivityIndicator color={colors.navy950} /> : undefined}
        />

        {mode === 'signup' && (
          <>
            <View style={styles.noteRow}>
              <Chip tone="pending">ONAY BEKLİYOR</Chip>
            </View>
            <Text style={styles.noteText}>
              Kaydın alındıktan sonra klinik ekibimiz bilgilerini onaylayana kadar hesabın bu durumda kalır.
            </Text>
          </>
        )}
      </Card>
    </Screen>
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
  tabRow: { flexDirection: 'row', gap: 8 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 11, borderWidth: 1, borderColor: colors.line },
  tabActive: { backgroundColor: colors.ice400, borderColor: colors.ice400 },
  tabText: { fontSize: 12.5, fontWeight: '700', color: colors.paperDim },
  tabTextActive: { color: colors.navy950 },
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
  errorText: { fontSize: 12, color: colors.red, lineHeight: 17 },
  noteRow: { flexDirection: 'row' },
  noteText: { fontSize: 11.5, color: colors.paperDim, lineHeight: 17 },
});
