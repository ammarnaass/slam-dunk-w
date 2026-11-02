import { StyleSheet } from 'react-native';
import { THEME } from '../../../constants/theme';

export const commentsStyles = StyleSheet.create({
  discussionsPanel: {
    padding: THEME.spacing.margin,
    gap: 14,
  },
  discussionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  discussionsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discussionsTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  commentsCountPill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  commentsCountText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  latestSorter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  latestSorterText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  commentInputBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: THEME.colors.surfaceContainerLow,
    padding: 12,
    borderRadius: THEME.radius.xl,
  },
  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputFormArea: {
    flex: 1,
    gap: 8,
  },
  commentTextInput: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: THEME.colors.onSurface,
    ...THEME.typography.bodySm,
    textAlign: 'right',
  },
  inputBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sendCommentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: THEME.radius.md,
  },
  sendCommentText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  commentsStream: {
    gap: 10,
  },
  commentCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 14,
    borderRadius: THEME.radius.xl,
    gap: 8,
  },
  commentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  vipTagPill: {
    backgroundColor: 'rgba(238, 152, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  vipTagText: {
    color: THEME.colors.secondary,
    fontSize: 9,
    fontWeight: '800',
  },
  commentTimestamp: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  commentText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurface,
    lineHeight: 20,
    textAlign: 'right',
    paddingRight: 46,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 46,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  likeTextActive: {
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },
  replyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replyText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
});
