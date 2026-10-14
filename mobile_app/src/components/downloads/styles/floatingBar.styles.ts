import { StyleSheet } from 'react-native';
import { THEME } from '../../../constants/theme';

export const floatingBarStyles = StyleSheet.create({
  floatingActionBar: {
    position: 'absolute',
    bottom: 20,
    left: THEME.spacing.margin,
    right: THEME.spacing.margin,
    zIndex: 50,
  },
  floatingBarInner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(38, 42, 51, 0.96)',
    paddingHorizontal: THEME.spacing.spaceMd,
    paddingVertical: THEME.spacing.spaceSm,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  floatingBarLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.colors.primaryContainer,
  },
  floatingBarTexts: {
    alignItems: 'flex-end',
  },
  floatingCountText: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  floatingSizeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  floatingBarActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  floatingCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  floatingCancelText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
  },
  floatingDeleteBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.primaryContainer,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  floatingDeleteText: {
    ...THEME.typography.labelMd,
    fontWeight: '700',
    color: THEME.colors.onPrimaryContainer,
  },
});
