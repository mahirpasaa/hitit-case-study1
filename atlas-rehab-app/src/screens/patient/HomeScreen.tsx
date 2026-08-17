import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { useAppState } from '../../context/AppState';

export function HomeScreen() {
  const { currentPatient, exercises, appointments, toggleExercise, logout } = useAppState();
  const navigation = useNavigation<any>();

  const myExercises = exercises.filter((e) => e.patientId === currentPatient?.id);
  const done = myExercises.filter((e) => e.done).length;
  const myAppt = appointments.find((a) => a.patientId === currentPatient?.id && a.status !== 'pending');

  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.greetEyebrow}>Merhaba,</Text>
          <Text style={styles.greetTitle}>{currentPatient?.name ?? 'Hasta'}</Text>
        </View>
        <Pressable onPress={logout} style={styles.logoutBtn}>
          <Icon name="user" size={16} color={colors.paperDim} />
        </Pressable>
      </View>

      <Card gradient style={styles.streakCard}>
        <View style={styles.flameCircle}>
          <Icon name="flame" size={18} color={colors.amber} />
        </View>
        <View>
          <Text style={styles.streakNum}>{currentPatient?.streak ?? 0} gün</Text>
          <Text style={styles.streakLbl}>üst üste egzersiz serisi</Text>
        </View>
      </Card>

      <Text style={styles.sectionLabel}>
        Bugünün Egzersizleri &middot; {done}/{myExercises.length}
      </Text>
      <View style={{ gap: 8 }}>
        {myExercises.map((ex) => (
          <Pressable
            key={ex.id}
            style={styles.exItem}
            onPress={() => navigation.navigate('ExerciseDetail', { id: ex.id })}
          >
            <View style={styles.exIcon}>
              <Icon name="stretch" size={16} color={colors.ice300} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.exTitle}>{ex.name}</Text>
              <Text style={styles.exSub}>
                {ex.sets} set &times; {ex.reps} tekrar
              </Text>
            </View>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                toggleExercise(ex.id);
              }}
              style={[styles.check, ex.done && styles.checkDone]}
            >
              {ex.done && <Icon name="check" size={12} color={colors.ink} />}
            </Pressable>
          </Pressable>
        ))}
      </View>

      {myAppt && (
        <Card style={styles.apptCard}>
          <View style={styles.apptIcon}>
            <Icon name="calendar" size={15} color={colors.ice300} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.apptLbl}>{myAppt.status === 'confirmed' ? 'ONAYLI RANDEVU' : 'YAKLAŞAN RANDEVU'}</Text>
            <Text style={styles.apptTitle}>{myAppt.confirmedSlot ?? myAppt.offeredSlots[0] ?? '—'}</Text>
            <Text style={styles.apptSub}>{myAppt.reason} &middot; Atlas Rehab Center</Text>
          </View>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 4 },
  greetEyebrow: { fontSize: 12, color: colors.ice300, fontWeight: '600' },
  greetTitle: { fontFamily: fonts.display, fontSize: 21, color: colors.white, marginTop: 1 },
  logoutBtn: {
    width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  streakCard: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  flameCircle: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(224,168,60,0.18)', alignItems: 'center', justifyContent: 'center' },
  streakNum: { fontFamily: fonts.display, fontSize: 17, color: colors.white },
  streakLbl: { fontSize: 11.5, color: colors.paperDim, marginTop: 2 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: colors.paperDim, marginTop: 2 },
  exItem: {
    flexDirection: 'row', alignItems: 'center', gap: 11,
    padding: 12, borderRadius: 14,
    backgroundColor: 'rgba(159,178,219,0.05)', borderWidth: 1, borderColor: 'rgba(159,178,219,0.09)',
  },
  exIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(111,168,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  exTitle: { fontSize: 13.5, fontWeight: '700', color: colors.white },
  exSub: { fontSize: 11.5, color: colors.paperDim, marginTop: 1 },
  check: { width: 24, height: 24, borderRadius: 999, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: colors.green, borderColor: colors.green },
  apptCard: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  apptIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(111,168,255,0.14)', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  apptLbl: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.6, color: colors.paperDim, textTransform: 'uppercase' },
  apptTitle: { fontSize: 14, fontWeight: '700', color: colors.white, marginTop: 2 },
  apptSub: { fontSize: 11.5, color: colors.paperDim, marginTop: 2 },
});
