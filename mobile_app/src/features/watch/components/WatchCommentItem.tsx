import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { THEME } from '../../../constants/theme';
import { Icon } from '../../../components/Icon';
import { CommentItem } from '../types/watch.types';
import { commentsStyles } from '../styles/comments.styles';

interface WatchCommentItemProps {
  item: CommentItem;
  onToggleLike: (id: string) => void;
}

export const WatchCommentItem: React.FC<WatchCommentItemProps> = ({
  item,
  onToggleLike,
}) => {
  return (
    <View style={commentsStyles.commentCard}>
      <View style={commentsStyles.commentTop}>
        <View style={commentsStyles.commentAuthorRow}>
          <Image source={{ uri: item.avatar }} style={commentsStyles.authorAvatar} />
          <View>
            <View style={commentsStyles.authorNameRow}>
              <Text style={commentsStyles.authorName}>{item.userName}</Text>
              {item.isVip && (
                <View style={commentsStyles.vipTagPill}>
                  <Text style={commentsStyles.vipTagText}>VIP</Text>
                </View>
              )}
            </View>
            <Text style={commentsStyles.commentTimestamp}>{item.timeAgo}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={commentsStyles.likeBtn}
          onPress={() => onToggleLike(item.id)}
        >
          <Icon
            name="thumb_up"
            size={14}
            color={
              item.isLiked
                ? THEME.colors.primaryContainer
                : THEME.colors.onSurfaceVariant
            }
            filled={item.isLiked}
          />
          <Text
            style={[
              commentsStyles.likeText,
              item.isLiked && commentsStyles.likeTextActive,
            ]}
          >
            {item.likes}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={commentsStyles.commentText}>{item.content}</Text>
    </View>
  );
};
