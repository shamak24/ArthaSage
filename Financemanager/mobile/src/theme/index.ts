import { StyleSheet } from 'react-native';

export const colors = {
  background: '#0a0a0f',
  surface: 'rgba(255,255,255,0.05)',
  surfaceHover: 'rgba(255,255,255,0.08)',
  surfaceBorder: 'rgba(255,255,255,0.1)',
  surfaceBorderLight: 'rgba(255,255,255,0.15)',

  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDim: 'rgba(99,102,241,0.15)',
  primaryGlow: 'rgba(99,102,241,0.25)',

  accent: '#a855f7',
  accentDim: 'rgba(168,85,247,0.15)',

  success: '#10b981',
  successDim: 'rgba(16,185,129,0.1)',

  warning: '#f59e0b',
  warningDim: 'rgba(245,158,11,0.1)',

  danger: '#ef4444',
  dangerDim: 'rgba(239,68,68,0.1)',

  text: '#ffffff',
  textSecondary: '#94a3b8',
  textTertiary: '#64748b',
  textMuted: '#475569',

  cardGradientStart: 'rgba(99,102,241,0.12)',
  cardGradientEnd: 'rgba(168,85,247,0.12)',

  // Chart palette
  chart: ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#a855f7', '#c084fc'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
};

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: spacing.lg,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  textMuted: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
