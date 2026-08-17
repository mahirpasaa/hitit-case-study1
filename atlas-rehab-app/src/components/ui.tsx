import React, { PropsWithChildren } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export function Card({
  children,
  style,
  gradient = false,
  flat = false,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle>; gradient?: boolean; flat?: boolean }>) {
  if (gradient) {
    return (
      <LinearGradient
        colors={['rgba(28,63,143,0.32)', 'rgba(16,32,77,0.5)'] as const}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, style]}
      >
        {children}
      </LinearGradient>
    );
  }
  return <View style={[styles.card, flat && styles.cardFlat, style]}>{children}</View>;
}

export function SectionLabel({ children }: PropsWithChildren) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

type ChipTone = 'pending' | 'active' | 'expired' | 'info';
export function Chip({ tone, children }: PropsWithChildren<{ tone: ChipTone }>) {
  const toneStyle = {
    pending: { bg: 'rgba(224,168,60,0.16)', fg: colors.amber },
    active: { bg: 'rgba(79,183,131,0.16)', fg: colors.green },
    expired: { bg: 'rgba(224,100,92,0.16)', fg: colors.red },
    info: { bg: 'rgba(111,168,255,0.16)', fg: colors.ice300 },
  }[tone];
  return (
    <View style={[styles.chip, { backgroundColor: toneStyle.bg }]}>
      <Text style={[styles.chipText, { color: toneStyle.fg }]}>{children}</Text>
    </View>
  );
}

type BtnVariant = 'primary' | 'ghost' | 'danger';
export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  disabled,
}: {
  title: string;
  onPress?: () => void;
  variant?: BtnVariant;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        variant === 'primary' && styles.btnPrimary,
        variant === 'ghost' && styles.btnGhost,
        variant === 'danger' && styles.btnDanger,
        pressed && { opacity: 0.85 },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.btnText,
          variant === 'primary' && { color: colors.navy950 },
          variant === 'ghost' && { color: colors.paperDim },
          variant === 'danger' && { color: colors.red },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function Pick({ label, on, onPress }: { label: string; on?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.pick, on && styles.pickOn]}>
      <Text style={[styles.pickText, on && styles.pickTextOn]}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, value, secure }: { label: string; value: string; secure?: boolean }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInput}>
        <Text style={{ color: colors.white, fontSize: 14 }}>{secure ? '•'.repeat(value.length || 8) : value}</Text>
      </View>
    </View>
  );
}

export function Note({ children }: PropsWithChildren) {
  return (
    <View style={styles.note}>
      <Text style={styles.noteText}>{children}</Text>
    </View>
  );
}

export function Avatar({ initials }: { initials: string }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 14,
    backgroundColor: colors.navy800,
  },
  cardFlat: {
    backgroundColor: 'rgba(159,178,219,0.05)',
    borderColor: 'rgba(159,178,219,0.09)',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.paperDim,
  },
  chip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  chipText: { fontSize: 11, fontWeight: '700' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 13,
    paddingVertical: 14,
  },
  btnPrimary: { backgroundColor: colors.ice400 },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line },
  btnDanger: { backgroundColor: 'rgba(224,100,92,0.16)', borderWidth: 1, borderColor: 'rgba(224,100,92,0.3)' },
  btnText: { fontSize: 14.5, fontWeight: '700', color: colors.white },
  pick: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(159,178,219,0.04)',
  },
  pickOn: { backgroundColor: colors.ice400, borderColor: colors.ice400 },
  pickText: { fontSize: 12.5, fontWeight: '600', color: colors.paperDim },
  pickTextOn: { color: colors.navy950, fontWeight: '700' },
  fieldLabel: { fontSize: 11.5, fontWeight: '700', color: colors.paperDim, letterSpacing: 0.3 },
  fieldInput: {
    backgroundColor: 'rgba(159,178,219,0.06)',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 13,
  },
  note: {
    flexDirection: 'row',
    gap: 9,
    backgroundColor: 'rgba(111,168,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(111,168,255,0.2)',
    borderRadius: 13,
    padding: 12,
  },
  noteText: { flex: 1, fontSize: 12.5, lineHeight: 18, color: colors.paperDim },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: colors.ice300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: '700', color: colors.navy950 },
});
