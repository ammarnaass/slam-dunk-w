import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { THEME } from '../../../constants/theme';
import { Icon } from '../../../components/Icon';
import { WatchCommentsPanelProps } from '../types/watch.types';
import { WatchCommentItem } from './WatchCommentItem';
import { commentsStyles } from '../styles/comments.styles';

export const WatchCommentsPanel: React.FC<WatchCommentsPanelProps> = ({
  comments,
  epNum,
  newComment,
  onNewCommentChange,
  onSendComment,
  onToggleLike,
}) => {
  return (
    <View style={commentsStyles.discussionsPanel}>
      <View style={commentsStyles.discussionsHeader}>
        <View style={commentsStyles.discussionsTitleRow}>
          <Text style={commentsStyles.discussionsTitle}>نقاشات الأبطال</Text>
          <View style={commentsStyles.commentsCountPill}>
            <Text style={commentsStyles.commentsCountText}>{comments.length}</Text>
          </View>
        </View>

        <View style={commentsStyles.latestSorter}>
          <Text style={commentsStyles.latestSorterText}>الأحدث أولاً</Text>
          <Icon name="swap_vert" size={16} color={THEME.colors.onSurfaceVariant} />
        </View>
      </View>

      <View style={commentsStyles.commentInputBox}>
        <View style={commentsStyles.inputAvatar}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida/AEtjO1UqLVIEiU9HTEZwLj5XT18efMovYDsIt0odDPiQwRI-2kSKsB6LtCjmqPZKVvQ6hWVGxw8P1ll2jKa324hpg-MPBcPpyYNDTVuLhePTwl4fG2RHdUiiXdafOKHAnwXRb4iJN1-buVYoIF1ZMuRQlVpPuQnavyAGOiyfIp8UUtgnVtn3PcxcptuY9g7r3f6BgRGNIUCHpLP8UHcWOlrIU31Ad_Zalj5GaLbZgRWAI593ZFgg1EYzM0vqAko',
            }}
            style={commentsStyles.authorAvatar}
          />
        </View>

        <View style={commentsStyles.inputFormArea}>
          <TextInput
            style={commentsStyles.commentTextInput}
            placeholder={`شاركنا رأيك في أحداث الحلقة ${epNum}...`}
            placeholderTextColor={THEME.colors.onSurfaceVariant}
            value={newComment}
            onChangeText={onNewCommentChange}
            multiline
          />

          <View style={commentsStyles.inputBottomRow}>
            <View style={commentsStyles.emojiRow}>
              {['🔥', '🏀', '👏', '😱'].map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => onNewCommentChange(newComment + emoji)}
                >
                  <Text style={{ fontSize: 16 }}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={commentsStyles.sendCommentBtn}
              onPress={onSendComment}
            >
              <Text style={commentsStyles.sendCommentText}>نشر</Text>
              <Icon
                name="arrow_forward"
                size={14}
                color={THEME.colors.onPrimaryContainer}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={commentsStyles.commentsStream}>
        {comments.map((item) => (
          <WatchCommentItem
            key={item.id}
            item={item}
            onToggleLike={onToggleLike}
          />
        ))}
      </View>
    </View>
  );
};
