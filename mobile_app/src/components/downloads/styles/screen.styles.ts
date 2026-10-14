import { StyleSheet } from 'react-native';
import { THEME } from '../../../constants/theme';

export const screenStyles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* SUB-HEADER */
  subHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.margin,
    paddingTop: THEME.spacing.spaceSm,
    paddingBottom: THEME.spacing.spaceMd,
  },
  subHeaderRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: THEME.spacing.spaceSm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeaderTitles: {
    alignItems: 'flex-end',
  },
  subHeaderTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  subHeaderSubtitle: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
    marginTop: 2,
  },
  toggleSelectModeBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  toggleSelectModeBtnActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderWidth: 1,
    borderColor: THEME.colors.primaryContainer,
  },
  toggleSelectModeText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
  },
  toggleSelectModeTextActive: {
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },

  /* BATCH & SORT BAR */
  batchAndSortBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.margin,
    marginBottom: THEME.spacing.spaceMd,
  },
  batchSelectArea: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  selectAllTrigger: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  selectAllText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurfaceVariant,
  },
  batchDividerDot: {
    color: 'rgba(223, 226, 238, 0.4)',
    fontSize: 12,
  },
  selectedCounterText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
  },
  sortPillsContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: THEME.colors.surfaceContainerLow,
    padding: 3,
    borderRadius: THEME.radius.xl,
    gap: 2,
  },
  sortPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.lg,
  },
  sortPillActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  sortPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  sortPillTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },

  /* SERIES GROUP */
  seriesGroupCard: {
    marginHorizontal: THEME.spacing.margin,
    marginBottom: THEME.spacing.spaceLg,
    gap: THEME.spacing.spaceSm,
  },
  seriesHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surfaceContainerLow,
    paddingHorizontal: THEME.spacing.spaceMd,
    paddingVertical: THEME.spacing.spaceSm,
    borderRadius: THEME.radius.xl,
  },
  seriesHeaderRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  seriesIconBox: {
    width: 34,
    height: 34,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seriesTitles: {
    alignItems: 'flex-end',
  },
  seriesNameRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  seriesNameText: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  seriesYearBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: THEME.radius.DEFAULT,
    backgroundColor: THEME.colors.surfaceVariant,
  },
  seriesYearText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
  },
  seriesMetaText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  deleteSeriesBtn: {
    padding: 6,
  },

  /* EMPTY CONTAINER */
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginHorizontal: THEME.spacing.margin,
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.xl,
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
    lineHeight: 18,
  },
});
