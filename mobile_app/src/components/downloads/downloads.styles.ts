import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
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

  /* STORAGE CARD */
  storageCard: {
    marginHorizontal: THEME.spacing.margin,
    marginBottom: THEME.spacing.spaceLg,
    borderRadius: THEME.radius.xl,
    backgroundColor: THEME.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 6,
  },
  storageAmbientRed: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
  },
  storageAmbientAmber: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(238, 152, 0, 0.1)',
  },
  storageCardInner: {
    padding: THEME.spacing.spaceMd,
    gap: THEME.spacing.spaceMd,
  },
  storageHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storageHeaderInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  memoryIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storageMeta: {
    alignItems: 'flex-end',
  },
  storageTotalLabel: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  storageUsedRow: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  storageUsedValue: {
    ...THEME.typography.headlineMd,
    fontWeight: '800',
    color: THEME.colors.onSurface,
  },
  storageUsedCount: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
  },
  freePercentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.DEFAULT,
    backgroundColor: THEME.colors.surfaceContainerHighest,
  },
  freePercentText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },

  /* METER TRACK */
  meterContainer: {
    gap: 6,
  },
  meterTrack: {
    flexDirection: 'row-reverse',
    height: 12,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceContainerLowest,
    overflow: 'hidden',
    padding: 2,
  },
  meterSegment: {
    height: '100%',
  },
  meterSegmentPrimary: {
    backgroundColor: THEME.colors.primaryContainer,
    borderRadius: THEME.radius.full,
  },
  meterSegmentVariant: {
    backgroundColor: THEME.colors.surfaceVariant,
  },
  meterSegmentVoid: {
    backgroundColor: 'rgba(38, 42, 51, 0.5)',
  },
  legendRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  legendItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
  },
  legendLabelMuted: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },

  /* CLEAN CACHE */
  cleanCacheRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: THEME.spacing.spaceXs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  cleanCacheInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  cleanCacheText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
  },
  cleanCacheBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceBright,
  },
  cleanCacheBtnDone: {
    backgroundColor: 'rgba(238, 152, 0, 0.15)',
  },
  cleanCacheBtnText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
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

  /* EPISODES LIST */
  episodesList: {
    gap: 8,
  },
  episodeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 10,
    borderRadius: THEME.radius.xl,
    gap: 10,
  },
  episodeRowSelected: {
    backgroundColor: THEME.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: THEME.colors.primaryContainer,
  },
  checkboxBtn: {
    padding: 4,
  },
  checkboxBtnSelected: {},
  thumbContainer: {
    width: 110,
    height: 64,
    borderRadius: THEME.radius.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: THEME.colors.surfaceContainerLowest,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: 'rgba(10, 14, 22, 0.6)',
  },
  epNumberTag: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: 'rgba(10, 14, 22, 0.85)',
  },
  epNumberText: {
    ...THEME.typography.labelSm,
    fontSize: 9,
    color: THEME.colors.onSurface,
  },
  qualityTag: {
    position: 'absolute',
    top: 4,
    left: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: THEME.colors.primaryContainer,
  },
  qualityTagHD: {
    backgroundColor: THEME.colors.surfaceVariant,
  },
  qualityTagText: {
    ...THEME.typography.labelSm,
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.onPrimaryContainer,
  },
  episodeInfo: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 3,
  },
  episodeTitle: {
    ...THEME.typography.bodyMd,
    fontWeight: '600',
    color: THEME.colors.onSurface,
    textAlign: 'right',
  },
  episodeMetaRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  episodeMetaText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  episodeMetaDot: {
    color: 'rgba(223, 226, 238, 0.4)',
    fontSize: 10,
  },
  episodeSizeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  watchedStatusRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  watchedStatusText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
  },
  progressContainer: {
    width: 100,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.surfaceVariant,
    overflow: 'hidden',
    marginTop: 3,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.primaryContainer,
    borderRadius: 2,
  },
  notStartedText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  deleteSingleBtn: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
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

  /* SETTINGS SECTION */
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

  /* FLOATING BULK ACTION BAR */
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
