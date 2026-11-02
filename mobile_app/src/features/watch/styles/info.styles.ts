import { StyleSheet } from 'react-native';
import { THEME } from '../../../constants/theme';

export const infoStyles = StyleSheet.create({
  episodeInfoPanel: {
    padding: THEME.spacing.margin,
    gap: 10,
  },
  infoTagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  seasonTag: {
    backgroundColor: THEME.colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  seasonTagText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  genreTag: {
    backgroundColor: 'rgba(238, 152, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  genreTagText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
  },
  ratingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginRight: 'auto',
  },
  ratingTagText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  epMainTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
    lineHeight: 24,
    textAlign: 'right',
  },
  epSynopsis: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    lineHeight: 20,
    textAlign: 'right',
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  nextEpBtn: {
    flex: 1,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 5,
  },
  nextEpText: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  shareActionBtn: {
    width: 48,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
