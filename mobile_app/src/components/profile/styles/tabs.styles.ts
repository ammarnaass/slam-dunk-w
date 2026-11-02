import { StyleSheet } from 'react-native';
import { THEME } from '../../../constants/theme';

export const tabsStyles = StyleSheet.create({
  tabsSwitcher: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surfaceContainerLow,
    padding: 3,
    borderRadius: THEME.radius.md,
  },
  tabSwitchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabSwitchBtnActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  tabSwitchText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurfaceVariant,
  },
  tabSwitchTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  listContainer: {
    gap: 10,
  },
  favListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 10,
    borderRadius: THEME.radius.md,
  },
  favThumb: {
    width: 60,
    height: 80,
    borderRadius: 6,
    backgroundColor: THEME.colors.surfaceContainerLowest,
  },
  favMeta: {
    flex: 1,
    gap: 4,
  },
  favTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  favRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  favRatingText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  favSub: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
  },
  historyTimeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
