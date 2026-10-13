import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';

export const CommentsTab: React.FC = () => {
  return (
    <View style={styles.commentsTabContent}>
      {/* Comment 1 */}
      <View style={styles.commentItem}>
        <View style={styles.commentHeader}>
          <View style={styles.commentUserRow}>
            <View style={styles.commentAvatar}>
              <Text style={styles.commentAvatarText}>ط</Text>
            </View>
            <View>
              <View style={styles.commentNameRow}>
                <Text style={styles.commentName}>طارق الأسطورة</Text>
                <View style={styles.commentVipPill}>
                  <Text style={styles.commentVipText}>عضو VIP</Text>
                </View>
              </View>
              <Text style={styles.commentTime}>منذ 15 دقيقة</Text>
            </View>
          </View>
          <Icon name="star" size={14} color={THEME.colors.secondary} filled />
        </View>
        <Text style={styles.commentBody}>
          العمل المفضل عبر كل العصور! جودة الترميم هنا مذهلة والصوت كأنك تشاهده لأول مرة.
        </Text>
      </View>

      {/* Comment 2 */}
      <View style={styles.commentItem}>
        <View style={styles.commentHeader}>
          <View style={styles.commentUserRow}>
            <View style={styles.commentAvatar}>
              <Text style={styles.commentAvatarText}>ر</Text>
            </View>
            <View>
              <Text style={styles.commentName}>ريم الفهد</Text>
              <Text style={styles.commentTime}>منذ 45 دقيقة</Text>
            </View>
          </View>
          <Icon name="star" size={14} color={THEME.colors.secondary} filled />
        </View>
        <Text style={styles.commentBody}>
          دبلجة سبيستون جزء من الروح، شكراً على توفير السلسلة كاملة بهذه السلاسة!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentsTabContent: {
    paddingHorizontal: THEME.spacing.margin,
    marginTop: 14,
    gap: 10,
  },
  commentItem: {
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 14,
    borderRadius: THEME.radius.lg,
    gap: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentAvatarText: {
    color: THEME.colors.white,
    fontWeight: 'bold',
  },
  commentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  commentName: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  commentVipPill: {
    backgroundColor: 'rgba(238, 152, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  commentVipText: {
    color: THEME.colors.secondary,
    fontSize: 9,
    fontWeight: '800',
  },
  commentTime: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
  },
  commentBody: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurface,
    lineHeight: 20,
    textAlign: 'right',
  },
});
