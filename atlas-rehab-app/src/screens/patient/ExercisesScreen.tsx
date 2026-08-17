import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { useAppState } from '../../context/AppState';

export function ExercisesScreen() {
  const { currentPatient, exercises, toggleExercise } = useAppState();
  const navigation = useNavigation<any>();
  const myExercises = exercises.filter((e) => e.patientId === currentPatient?.id);

  return (
    <Screen>
      <Text style={styles.title}>Egzersizlerim</Text>
      <Text style={styles.sub}>Klinik ekibinin sana özel atadığı egzersiz programı.</Text>
      <View style={{ gap: 9 }}>
        {myExercises.map((ex) => (
          <Pressable key={ex.id} style={styles.item} onPress={() => navigation.navigate('ExerciseDetail', { id: ex.id })}>
            <View style={styles.icon}>
              <Icon name="stretch" size={17} color={colors.ice300} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{ex.name}</Text>
              <Text style={styles.itemSub}>
                {ex.sets} set &times; {ex.reps} tekrar{ex.holdSeconds ? ` · ${ex.holdSeconds}sn tutuş` : ''}
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
        {myExercises.length === 0 && <Text style={styles.empty}>Henüz atanmış bir egzersiz yok.</Text>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.display, fontSize: 20, color: colors.white, marginTop: 6 },
  sub: { fontSize: 12.5, color: colors.paperDim, marginTop: -6, marginBottom: 2, lineHeight: 18 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 11,
    padding: 13, borderRadius: 14,
    backgroundColor: 'rgba(159,178,219,0.05)', borderWidth: 1, borderColor: 'rgba(159,178,219,0.09)',
  },
  icon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(111,168,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 14, fontWeight: '700', color: colors.white },
  itemSub: { fontSize: 11.5, color: colors.paperDim, marginTop: 2 },
  check: { width: 25, height: 25, borderRadius: 999, borderWidth: 1.5, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  checkDone: { backgroundColor: colors.green, borderColor: colors.green },
  empty: { fontSize: 12.5, color: colors.paperDim, textAlign: 'center', paddingTop: 20 },
});
