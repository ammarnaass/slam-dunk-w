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
  headerBar: {
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
  headerTitleWrap: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  headerSub: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
    marginTop: 2,
  },

  /* HERO BANNER */
  heroBanner: {
    marginHorizontal: THEME.spacing.margin,
    marginTop: THEME.spacing.spaceSm,
    marginBottom: THEME.spacing.spaceMd,
    padding: THEME.spacing.spaceMd,
    borderRadius: THEME.radius.xl,
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'flex-end',
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.DEFAULT,
  },
  badgeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  heroMainTitle: {
    ...THEME.typography.headlineMd,
    color: THEME.colors.onSurface,
  },
  heroDesc: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'right',
    lineHeight: 18,
  },

  /* TEAM FILTER */
  filterPillsRow: {
    marginBottom: THEME.spacing.spaceMd,
  },
  filterPillsList: {
    paddingHorizontal: THEME.spacing.margin,
    flexDirection: 'row-reverse',
    gap: 8,
  },
  teamPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  teamPillActive: {
    backgroundColor: THEME.colors.primaryContainer,
    borderColor: THEME.colors.primaryContainer,
  },
  teamPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  teamPillTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },

  /* CAROUSEL */
  carouselSection: {
    marginBottom: THEME.spacing.spaceLg,
  },
  sectionHeader: {
    paddingHorizontal: THEME.spacing.margin,
    marginBottom: THEME.spacing.spaceSm,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  sectionSubtitle: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  carouselList: {
    paddingHorizontal: THEME.spacing.margin,
    flexDirection: 'row-reverse',
    gap: 12,
  },

  /* DETAILED SECTION */
  detailedSection: {
    paddingHorizontal: THEME.spacing.margin,
    gap: THEME.spacing.spaceSm,
  },
  detailedSectionTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
    textAlign: 'right',
  },
  cardsGrid: {
    gap: 12,
  },
  charDetailCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.spaceMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 10,
  },
  charCardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
  },
  charAvatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    position: 'relative',
    backgroundColor: THEME.colors.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: THEME.colors.primaryContainer,
  },
  charAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  charJerseyBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceContainer,
  },
  charJerseyText: {
    color: THEME.colors.onPrimaryContainer,
    fontSize: 9,
    fontWeight: '900',
  },
  charHeaderInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  charNameText: {
    ...THEME.typography.bodyLg,
    fontWeight: '700',
    color: THEME.colors.onSurface,
  },
  charEnNameText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 1,
  },
  roleTag: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  roleTagText: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  charDescText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'right',
    lineHeight: 18,
  },
  charFooter: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 8,
  },
  teamBadge: {
    backgroundColor: 'rgba(238, 152, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  teamBadgeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  posBadge: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  posBadgeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 22, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAvatarLargeWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: THEME.colors.primaryContainer,
    position: 'relative',
    marginBottom: 14,
  },
  modalAvatarLarge: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  modalJerseyLarge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: THEME.colors.surfaceContainer,
  },
  modalJerseyLargeText: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '900',
    fontSize: 12,
  },
  modalName: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
    textAlign: 'center',
  },
  modalEnName: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  modalBadgesRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginBottom: 10,
  },
  modalTeamPill: {
    backgroundColor: 'rgba(238, 152, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.DEFAULT,
  },
  modalTeamPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  modalPosPill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.DEFAULT,
  },
  modalPosPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  modalRole: {
    ...THEME.typography.labelMd,
    color: THEME.colors.primary,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalDesc: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalActionBtn: {
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: THEME.radius.lg,
    width: '100%',
    alignItems: 'center',
  },
  modalActionBtnText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
});
