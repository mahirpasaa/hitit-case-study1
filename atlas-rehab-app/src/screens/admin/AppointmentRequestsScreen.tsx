import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Avatar, Chip } from '../../components/ui';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { useAppState } from '../../context/AppState';

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export function AppointmentRequestsScreen() {
  const { appointments, patients } = useAppState();
  const navigation = useNavigation<any>();

  return (
    <Screen>
      <Text style={styles.title}>Randevu Talepleri</Text>
      <View>
        {appointments.map((a) => {
          const patient = patients.find((p) => p.id === a.patientId);
          if (!patient) return null;
          return (
            <Pressable key={a.id} style={styles.row} onPress={() => navigation.navigate('SlotOffer', { id: a.id })}>
              <Avatar initials={initials(patient.name)} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{patient.name}</Text>
                <Text style={styles.sub}>
                  {a.reason} &middot; Tercih: {a.preferredDays.join('/')} &middot; {a.preferredTime}
                </Text>
              </View>
              <Chip tone={a.status === 'confirmed' ? 'active' : a.status === 'offered' ? 'info' : 'pending'}>
                {a.status === 'confirmed' ? 'ONAYLANDI' : a.status === 'offered' ? 'TEKLİF GÖNDERİLDİ' : 'YANIT BEKLİYOR'}
              </Chip>
            </Pressable>
          );
        })}
        {appointments.length === 0 && <Text style={styles.empty}>Randevu talebi yok.</Text>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 20, color: colors.white, marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(159,178,219,0.09)' },
  name: { fontSize: 13.5, fontWeight: '700', color: colors.white },
  sub: { fontSize: 11, color: colors.paperDim, marginTop: 2 },
  empty: { fontSize: 12.5, color: colors.paperDim, textAlign: 'center', paddingTop: 20 },
});
