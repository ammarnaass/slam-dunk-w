import { StyleSheet } from 'react-native';
import { THEME } from '../../../constants/theme';

export const settingsCardStyles = StyleSheet.create({
  settingsSection: {
    marginHorizontal: THEME.spacing.margin,
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.spaceMd,
    gap: THEME.spacing.spaceMd,
  },
  settingsHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  settingsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius.lg,
    backgroundColor: 'rgba(238, 152, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsTitles: {
    alignItems: 'flex-end',
  },
  settingsTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  settingsSubtitle: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingLabels: {
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: 12,
  },
  settingLabelMain: {
    ...THEME.typography.bodyMd,
    fontWeight: '600',
    color: THEME.colors.onSurface,
  },
  settingLabelDesc: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
    textAlign: 'right',
  },
  qualitySegmentGroup: {
    flexDirection: 'row-reverse',
    backgroundColor: THEME.colors.surfaceContainerHigh,
    padding: 3,
    borderRadius: THEME.radius.lg,
    gap: 2,
  },
  qualitySegmentBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.DEFAULT,
  },
  qualitySegmentBtnActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  qualitySegmentText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  qualitySegmentTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  quotaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  quotaBadgeText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
});
