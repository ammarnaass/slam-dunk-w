import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  resultsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.margin,
    paddingVertical: 12,
  },
  resultsCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultsTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  counterPill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.xs,
  },
  counterText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  viewModeBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewModeBtnActive: {
    backgroundColor: THEME.colors.surfaceContainerHighest,
  },
  flatListContent: {
    paddingHorizontal: THEME.spacing.margin,
    paddingBottom: 24,
    gap: 12,
  },
  gridRow: {
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  emptySubtitle: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 240,
  },
});
