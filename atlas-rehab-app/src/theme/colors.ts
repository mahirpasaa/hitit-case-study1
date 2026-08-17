export const colors = {
  ink: '#05070f',
  navy950: '#0a1128',
  navy900: '#0d1638',
  navy800: '#10204d',
  navy700: '#16306e',
  navy600: '#1c3f8f',
  ice400: '#6fa8ff',
  ice300: '#9cc3ff',
  paper: '#f4f6fb',
  paperDim: '#c9cfe0',
  white: '#ffffff',
  line: 'rgba(159,178,219,0.16)',
  lineSoft: 'rgba(159,178,219,0.09)',
  amber: '#e0a83c',
  green: '#4fb783',
  red: '#e0645c',
} as const;

export type ColorToken = keyof typeof colors;
