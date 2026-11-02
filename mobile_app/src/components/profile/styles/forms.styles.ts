import { StyleSheet } from 'react-native';
import { THEME } from '../../../constants/theme';

export const formsStyles = StyleSheet.create({
  sectionHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.primaryContainer,
  },
  titleDotAmber: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.secondary,
  },
  sectionHeading: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  formCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.lg,
    padding: 16,
    gap: 14,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
    textAlign: 'right',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  textInput: {
    flex: 1,
    color: THEME.colors.onSurface,
    ...THEME.typography.bodyMd,
    textAlign: 'right',
  },
  inputPrefix: {
    color: THEME.colors.onSurfaceVariant,
    fontSize: 16,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderPill: {
    flex: 1,
    height: 42,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderPillActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  genderText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurfaceVariant,
  },
  genderTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTitle: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
  },
  settingDesc: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  qualityPill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qualityPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryContainer,
    fontWeight: '800',
  },
  formDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    padding: 2,
    justifyContent: 'center',
  },
  switchTrackActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.colors.onSurfaceVariant,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: THEME.colors.white,
  },
  apiInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  apiInput: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    height: 44,
  },
  apiSaveBtn: {
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apiSaveBtnText: {
    color: THEME.colors.white,
    fontWeight: '700',
  },
  accountActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  logoutBtn: {
    flex: 1,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: 'rgba(214, 49, 53, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.error,
    fontWeight: '700',
  },
  loginBtn: {
    flex: 1,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.white,
    fontWeight: '700',
  },
  shareProfileBtn: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  shareProfileText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
  },
  versionFooter: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
  },
});
