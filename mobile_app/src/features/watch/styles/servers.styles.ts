import { StyleSheet } from 'react-native';
import { THEME } from '../../../constants/theme';

export const serversStyles = StyleSheet.create({
  serversPanel: {
    padding: THEME.spacing.margin,
    backgroundColor: THEME.colors.surfaceContainerLow,
    gap: 12,
  },
  serversPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serversTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  serversTitle: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSurface,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  tabRow: {
    flexDirection: 'row-reverse',
    gap: 6,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
    gap: 4,
  },
  tabBtnActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  tabBtnInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabTextInactive: {
    color: THEME.colors.onSurfaceVariant,
    fontSize: 12,
  },
  serverPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  serverPill: {
    flex: 1,
    padding: 10,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  serverPillActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.18)',
    borderWidth: 1,
    borderColor: THEME.colors.primaryContainer,
  },
  serverPillNormal: {
    backgroundColor: THEME.colors.surfaceContainer,
  },
  serverDotActive: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.primaryContainer,
  },
  serverName: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  serverNameActive: {
    color: THEME.colors.onSurface,
  },
  serverDesc: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  serverDescActive: {
    color: THEME.colors.primary,
  },
  audioSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 8,
    borderRadius: THEME.radius.md,
  },
  audioSwitchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  audioLabelText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
  },
  audioToggleCapsule: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surfaceContainerLowest,
    padding: 2,
    borderRadius: 8,
  },
  audioToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  audioToggleBtnActive: {
    backgroundColor: THEME.colors.secondaryContainer,
  },
  audioToggleText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  audioToggleTextActive: {
    color: THEME.colors.onSecondaryContainer,
    fontWeight: '700',
  },
});
