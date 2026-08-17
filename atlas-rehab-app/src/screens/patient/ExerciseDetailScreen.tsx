import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/ui';
import { Icon } from '../../components/Icon';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { useAppState } from '../../context/AppState';

export function ExerciseDetailScreen() {
  const { params } = useRoute<any>();
  const navigation = useNavigation<any>();
  const { exercises, toggleExercise } = useAppState();
  const ex = exercises.find((e) => e.id === params.id);
  if (!ex) return null;

  return (
    <Screen>
      <View style={styles.appbar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Icon name="chevronLeft" size={20} color={colors.paperDim} strokeWidth={2} />
        </Pressable>
        <Text style={styles.appbarTitle}>{ex.name}</Text>
      </View>

      <View style={styles.videoThumb}>
        <View style={styles.playBtn}>
          <Icon name="play" size={18} color={colors.navy950} />
        </View>
        <Text style={styles.duration}>{ex.durationLabel}</Text>
      </View>

      <View style={styles.statRow}>
        <StatTile value={String(ex.sets)} label="Set" />
        <StatTile value={String(ex.reps)} label="Tekrar" />
        <StatTile value={ex.holdSeconds ? `${ex.holdSeconds}sn` : '—'} label="Süre" />
      </View>

      <View style={styles.quote}>
        <Text style={styles.quoteWho}>FİZYOTERAPİST NOTU</Text>
        <Text style={styles.quoteText}>{ex.therapistNote}</Text>
      </View>

      <View style={{ flex: 1 }} />

      <Button
        title={ex.done ? 'Tamamlandı ✓' : 'Tamamlandı Olarak İşaretle'}
        icon={<Icon name="check" size={15} color={colors.navy950} />}
        onPress={() => toggleExercise(ex.id)}
        disabled={ex.done}
      />
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.skip}>Zorlandım, atla</Text>
      </Pressable>
    </Screen>
  );
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appbar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  back: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  appbarTitle: { fontSize: 16.5, fontWeight: '700', color: colors.white, flexShrink: 1 },
  videoThumb: {
    height: 150, borderRadius: 16, backgroundColor: colors.navy800, borderWidth: 1, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  playBtn: { width: 50, height: 50, borderRadius: 999, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  duration: {
    position: 'absolute', bottom: 10, right: 12, fontSize: 11, fontWeight: '700', color: colors.white,
    backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
  },
  statRow: { flexDirection: 'row', gap: 9 },
  statTile: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 13, backgroundColor: 'rgba(159,178,219,0.05)', borderWidth: 1, borderColor: 'rgba(159,178,219,0.09)' },
  statValue: { fontFamily: fonts.display, fontSize: 18, color: colors.white },
  statLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase', color: colors.paperDim, marginTop: 3 },
  quote: { borderLeftWidth: 2, borderLeftColor: colors.ice400, paddingLeft: 13, paddingVertical: 2 },
  quoteWho: { fontSize: 10.5, fontWeight: '700', color: colors.ice300, letterSpacing: 0.6, marginBottom: 4 },
  quoteText: { fontSize: 13, lineHeight: 20, color: colors.paperDim },
  skip: { textAlign: 'center', fontSize: 12.5, color: colors.paperDim, paddingVertical: 6 },
});
