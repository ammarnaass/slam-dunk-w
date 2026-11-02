import { StyleSheet } from 'react-native';
import { THEME } from '../../../constants/theme';

export const sectionStyles = StyleSheet.create({
  sectionContainer: {
    marginTop: 28,
    paddingHorizontal: THEME.spacing.margin,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleBarRed: {
    width: 5,
    height: 18,
    borderRadius: 2.5,
    backgroundColor: THEME.colors.primaryContainer,
  },
  titleBarAmber: {
    width: 5,
    height: 18,
    borderRadius: 2.5,
    backgroundColor: THEME.colors.secondary,
  },
  titleBarGold: {
    width: 5,
    height: 18,
    borderRadius: 2.5,
    backgroundColor: THEME.colors.secondaryContainer,
  },
  sectionTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  sectionSubtitle: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionLinkText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.primaryContainer,
  },
  badgeGoldPill: {
    backgroundColor: 'rgba(238, 152, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
  },
  badgeGoldText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
  },
  horizontalScrollList: {
    gap: 12,
    paddingVertical: 4,
  },
});
