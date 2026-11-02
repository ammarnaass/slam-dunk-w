import { StyleSheet } from 'react-native';
import { THEME } from '../../../constants/theme';

export const continueStyles = StyleSheet.create({
  ongoingCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.lg,
    padding: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  ongoingTopRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ongoingThumbnailFrame: {
    position: 'relative',
    width: 128,
    height: 80,
    borderRadius: THEME.radius.DEFAULT,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  ongoingThumbnail: {
    width: '100%',
    height: '100%',
  },
  ongoingPlayCircle: {
    ...StyleSheet.absoluteFill as object,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ongoingEpTag: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  ongoingEpText: {
    ...THEME.typography.labelSm,
    fontSize: 9,
    color: THEME.colors.onSurface,
  },
  ongoingMeta: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  ongoingAnimeName: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryContainer,
  },
  ongoingEpTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
    marginTop: 2,
  },
  ongoingBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ongoingTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ongoingTimeText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
  },
  resumePill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.sm,
  },
  resumeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.surfaceContainerHighest,
    overflow: 'hidden',
  },
  progressBarGlow: {
    height: '100%',
    backgroundColor: THEME.colors.primaryContainer,
    borderRadius: 3,
  },
  progressPercent: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
  },
});
