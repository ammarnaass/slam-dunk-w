import { StyleSheet } from 'react-native';
import { THEME } from '../../../constants/theme';

export const modalsStyles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.xl,
    padding: 20,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeading: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  modalInputGroup: {
    gap: 6,
  },
  modalInput: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    height: 46,
    color: THEME.colors.onSurface,
    textAlign: 'right',
  },
  modalSubmitBtn: {
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  modalSubmitText: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  createPlanBtn: {
    height: 42,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: THEME.colors.outlineVariant,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  createPlanBtnText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  textAreaInput: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 70,
    color: THEME.colors.onSurface,
    textAlign: 'right',
    textAlignVertical: 'top',
  },
});
