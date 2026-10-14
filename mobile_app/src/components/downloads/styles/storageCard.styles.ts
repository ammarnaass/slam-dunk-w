import { StyleSheet } from 'react-native';
import { THEME } from '../../../constants/theme';

export const storageCardStyles = StyleSheet.create({
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
});
