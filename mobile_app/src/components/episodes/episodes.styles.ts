import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const episodesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  searchBarRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: THEME.spacing.spaceSm,
    paddingHorizontal: THEME.spacing.margin,
    paddingTop: THEME.spacing.spaceSm,
    paddingBottom: THEME.spacing.spaceXs,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputContainer: {
    flex: 1,
    height: 44,
    borderRadius: THEME.radius.xl,
    backgroundColor: THEME.colors.surfaceContainerLow,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: THEME.colors.onSurface,
    ...THEME.typography.bodyMd,
  },
  clearSearchBtn: {
    padding: 6,
  },
  sortBtn: {
    width: 44,
    height: 44,
    borderRadius: THEME.radius.xl,
    backgroundColor: THEME.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sortBtnActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderColor: THEME.colors.primaryContainer,
  },

  /* FILTER PILLS */
  filterPillsRow: {
    marginVertical: THEME.spacing.spaceSm,
  },
  filterPillsList: {
    paddingHorizontal: THEME.spacing.margin,
    gap: 8,
  },
  rangePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  rangePillActive: {
    backgroundColor: THEME.colors.primaryContainer,
    borderColor: THEME.colors.primaryContainer,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  rangePillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  rangePillTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },

  /* HEADER INFO */
  headerInfoRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.margin,
    marginBottom: THEME.spacing.spaceSm,
  },
  episodesCountText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  dubbingNoticeText: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.primary,
  },

  /* LIST CONTENT */
  listContent: {
    paddingHorizontal: THEME.spacing.margin,
    paddingBottom: 40,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  emptyDesc: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
