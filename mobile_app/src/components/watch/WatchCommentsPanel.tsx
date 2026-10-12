import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { CommentItem } from '../../constants/watch-data';
import { Icon } from '../Icon';
import { styles } from './watch.styles';

interface WatchCommentsPanelProps {
  comments: CommentItem[];
  epNum: number;
  newComment: string;
  onNewCommentChange: (text: string) => void;
  onSendComment: () => void;
  onToggleLike: (id: string) => void;
}

export const WatchCommentsPanel: React.FC<WatchCommentsPanelProps> = ({
  comments,
  epNum,
  newComment,
  onNewCommentChange,
  onSendComment,
  onToggleLike,
}) => {
  return (
    <View style={styles.discussionsPanel}>
      <View style={styles.discussionsHeader}>
        <View style={styles.discussionsTitleRow}>
          <Icon name="forum" size={20} color={THEME.colors.primaryContainer} />
          <Text style={styles.discussionsTitle}>نقاشات المعجبين</Text>
          <View style={styles.commentsCountPill}>
            <Text style={styles.commentsCountText}>{comments.length + 182} تعليق</Text>
          </View>
        </View>

        <View style={styles.latestSorter}>
          <Text style={styles.latestSorterText}>الأحدث أولاً</Text>
          <Icon name="swap_vert" size={14} color={THEME.colors.onSurfaceVariant} />
        </View>
      </View>

      {/* Input Box */}
      <View style={styles.commentInputBox}>
        <View style={styles.inputAvatar}>
          <Icon name="person" size={18} color={THEME.colors.onSurfaceVariant} />
        </View>
        <View style={styles.inputFormArea}>
          <TextInput
            style={styles.commentTextInput}
            placeholder={`اكتب تعليقك حول الحلقة ${epNum} وحماس اللقاء...`}
            placeholderTextColor="rgba(223, 226, 238, 0.45)"
            value={newComment}
            onChangeText={onNewCommentChange}
          />
          <View style={styles.inputBottomRow}>
            <View style={styles.emojiRow}>
              <TouchableOpacity>
                <Icon name="sentiment_satisfied" size={18} color={THEME.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.sendCommentBtn}
              onPress={onSendComment}
              activeOpacity={0.8}
            >
              <Text style={styles.sendCommentText}>نشر</Text>
              <Icon name="arrow_forward" size={14} color={THEME.colors.onPrimaryContainer} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Comments Stream */}
      <View style={styles.commentsStream}>
        {comments.map((c) => (
          <View key={c.id} style={styles.commentCard}>
            <View style={styles.commentTop}>
              <View style={styles.commentAuthorRow}>
                <Image source={{ uri: c.avatar }} style={styles.authorAvatar} />
                <View>
                  <View style={styles.authorNameRow}>
                    <Text style={styles.authorName}>{c.userName}</Text>
                    {c.isVip && (
                      <View style={styles.vipTagPill}>
                        <Text style={styles.vipTagText}>عضو VIP</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.commentTimestamp}>{c.timeAgo}</Text>
                </View>
              </View>
              <Icon name="more_vert" size={18} color={THEME.colors.onSurfaceVariant} />
            </View>

            <Text style={styles.commentText}>{c.content}</Text>

            <View style={styles.commentActions}>
              <TouchableOpacity
                style={styles.likeBtn}
                onPress={() => onToggleLike(c.id)}
              >
                <Icon
                  name="thumb_up"
                  size={15}
                  color={c.isLiked ? THEME.colors.primaryContainer : THEME.colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.likeText,
                    c.isLiked && styles.likeTextActive,
                  ]}
                >
                  {c.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.replyBtn}>
                <Icon name="reply" size={15} color={THEME.colors.onSurfaceVariant} />
                <Text style={styles.replyText}>رد</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
