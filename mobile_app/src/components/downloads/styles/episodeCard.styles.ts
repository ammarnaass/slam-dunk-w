import { StyleSheet } from 'react-native';
import { THEME } from '../../../constants/theme';

export const episodeCardStyles = StyleSheet.create({
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
});
