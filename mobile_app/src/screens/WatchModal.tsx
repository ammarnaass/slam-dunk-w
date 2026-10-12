import React, { useState } from 'react';
import {
  View,
  Modal,
  ScrollView,
  Share,
  StatusBar,
} from 'react-native';
import { Episode } from '../types';
import { styles } from '../components/watch/watch.styles';
import { INITIAL_COMMENTS, SERVERS, CommentItem } from '../constants/watch-data';
import { WatchPlayerHeader } from '../components/watch/WatchPlayerHeader';
import { WatchVideoPlayer } from '../components/watch/WatchVideoPlayer';
import { WatchServersPanel } from '../components/watch/WatchServersPanel';
import { WatchEpisodeInfo } from '../components/watch/WatchEpisodeInfo';
import { WatchCommentsPanel } from '../components/watch/WatchCommentsPanel';

interface WatchModalProps {
  visible: boolean;
  episode: Episode | null;
  onClose: () => void;
  onNextEpisode?: () => void;
}

export const WatchModal: React.FC<WatchModalProps> = ({
  visible,
  episode,
  onClose,
  onNextEpisode,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedServer, setSelectedServer] = useState('s1');
  const [audioTrack, setAudioTrack] = useState<'dub' | 'sub'>('dub');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');

  if (!episode) return null;

  const epNum = episode.episode_number || episode.episodeNumber || 47;
  const nextEpNum = epNum + 1;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `أشاهد الحلقة ${epNum} من سلام دانك على ANIME DAZE: https://slam-dunk-w.vercel.app`,
      });
    } catch (_) {}
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    const item: CommentItem = {
      id: Date.now().toString(),
      userName: 'عمار الناصري',
      avatar:
        'https://lh3.googleusercontent.com/aida/AEtjO1UqLVIEiU9HTEZwLj5XT18efMovYDsIt0odDPiQwRI-2kSKsB6LtCjmqPZKVvQ6hWVGxw8P1ll2jKa324hpg-MPBcPpyYNDTVuLhePTwl4fG2RHdUiiXdafOKHAnwXRb4iJN1-buVYoIF1ZMuRQlVpPuQnavyAGOiyfIp8UUtgnVtn3PcxcptuY9g7r3f6BgRGNIUCHpLP8UHcWOlrIU31Ad_Zalj5GaLbZgRWAI593ZFgg1EYzM0vqAko',
      isVip: true,
      timeAgo: 'الآن',
      content: newComment.trim(),
      likes: 0,
    };
    setComments([item, ...comments]);
    setNewComment('');
  };

  const handleToggleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const liked = !c.isLiked;
          return {
            ...c,
            isLiked: liked,
            likes: liked ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      })
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* 1. Modal Header */}
        <WatchPlayerHeader
          onClose={onClose}
          onShare={handleShare}
          isBookmarked={isBookmarked}
          onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
        />

        <ScrollView
          style={styles.scrollBody}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 2. Embedded Cinematic Video Player (16:9) */}
          <WatchVideoPlayer
            thumbnailUrl={episode.thumbnail}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
          />

          {/* 3. Streaming Servers Preference Panel */}
          <WatchServersPanel
            servers={SERVERS}
            selectedServer={selectedServer}
            onSelectServer={setSelectedServer}
            audioTrack={audioTrack}
            onChangeAudioTrack={setAudioTrack}
          />

          {/* 4. Episode Info & Quick Actions */}
          <WatchEpisodeInfo
            episode={episode}
            epNum={epNum}
            nextEpNum={nextEpNum}
            onNextEpisode={onNextEpisode}
            onShare={handleShare}
          />

          {/* Visual Divider */}
          <View style={styles.sectionDivider} />

          {/* 5. Fan Discussions & Comments */}
          <WatchCommentsPanel
            comments={comments}
            epNum={epNum}
            newComment={newComment}
            onNewCommentChange={setNewComment}
            onSendComment={handleSendComment}
            onToggleLike={handleToggleLike}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};
