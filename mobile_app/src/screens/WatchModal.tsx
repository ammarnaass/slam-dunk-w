import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { useAppStore } from '../store/useAppStore';
import { fetchEpisodeComments, postEpisodeComment } from '../services/api';

interface WatchModalProps {
  visible: boolean;
  episode: Episode | null;
  onClose: () => void;
  onNextEpisode?: () => void;
}

function parseDurationToSeconds(duration?: string): number {
  if (!duration) return 1440;
  const cleaned = duration.replace(/[^0-9:]/g, '');
  const parts = cleaned.split(':').map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 1 && !isNaN(parts[0])) {
    return parts[0] * 60;
  }
  return 1440;
}

export const WatchModal: React.FC<WatchModalProps> = ({
  visible,
  episode,
  onClose,
  onNextEpisode,
}) => {
  const {
    currentUser,
    favorites,
    continueWatching,
    syncProgress,
    toggleFavorite,
  } = useAppStore();

  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedServer, setSelectedServer] = useState('s1');
  const [audioTrack, setAudioTrack] = useState<'dub' | 'sub'>('dub');
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [positionSeconds, setPositionSeconds] = useState(0);

  const epId = episode?.id || '';
  const totalDurationSeconds = useMemo(() => parseDurationToSeconds(episode?.duration), [episode?.duration]);

  // Determine bookmark status from real favorites
  const isBookmarked = useMemo(() => {
    if (!epId) return false;
    return favorites.some((f) => (typeof f === 'string' ? f === epId : f?.id === epId));
  }, [favorites, epId]);

  // Load existing progress & fetch comments on episode change
  useEffect(() => {
    if (!epId || !visible) return;

    // Check existing progress
    const existing = continueWatching.find(
      (cw) => cw.episodeId === epId || cw.episode?.id === epId
    );
    if (existing?.positionSeconds) {
      setPositionSeconds(existing.positionSeconds);
    } else {
      setPositionSeconds(0);
    }

    let isMounted = true;
    fetchEpisodeComments(epId)
      .then((apiComments) => {
        if (!isMounted) return;
        if (apiComments && apiComments.length > 0) {
          const mapped: CommentItem[] = apiComments.map((c: any) => ({
            id: c.id || String(Date.now()),
            userName: c.user?.name || c.userName || 'بطل الأنمي',
            avatar:
              c.user?.avatar ||
              c.avatar ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDwBLTC5yGIznP0iTZmVobozF5AZhsKyizalhORe4cSb2K9AG6_Xi1ABa5HbAYBvew7oOUIcf_pK9yKLgCTOUI6po_Z22DmdqNCBaHayW-ZfE1QQvrM3bwKaupIK9zTpE-7N7X2ER-Ynm-lUQ_TPqZZkhCde_h30-zdne6MWW01MULxumM8U-xGBXQ5sx2JoGUQjf2J7GjEitt9oxk38kLCjLfzupvSyNuUtIcbNGdbyinvpgSi33Df',
            isVip: c.user?.isVip ?? false,
            timeAgo: c.timeAgo || 'مؤخراً',
            content: c.content || '',
            likes: c.likes || 0,
          }));
          setComments(mapped);
        } else {
          setComments(INITIAL_COMMENTS);
        }
      })
      .catch(() => {
        if (isMounted) setComments(INITIAL_COMMENTS);
      });

    return () => {
      isMounted = false;
    };
  }, [epId, visible, continueWatching]);

  // Simulate video playback progress & periodically sync to backend
  const lastSyncedPositionRef = useRef(positionSeconds);
  useEffect(() => {
    if (!visible || !epId || !isPlaying) return;

    const timer = setInterval(() => {
      setPositionSeconds((prev) => {
        const next = prev + 5;
        return next > totalDurationSeconds ? totalDurationSeconds : next;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [visible, epId, isPlaying, totalDurationSeconds]);

  // Periodic watch progress sync to API (every 15s if position changed)
  useEffect(() => {
    if (!visible || !epId || positionSeconds <= 0) return;

    if (Math.abs(positionSeconds - lastSyncedPositionRef.current) >= 15) {
      lastSyncedPositionRef.current = positionSeconds;
      syncProgress(epId, positionSeconds, totalDurationSeconds);
    }
  }, [positionSeconds, visible, epId, totalDurationSeconds, syncProgress]);

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

  const handleClose = () => {
    if (epId && positionSeconds > 0) {
      syncProgress(epId, positionSeconds, totalDurationSeconds);
    }
    onClose();
  };

  const handleToggleBookmark = async () => {
    if (!epId) return;
    await toggleFavorite('episode', epId);
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !epId) return;
    const content = newComment.trim();
    setNewComment('');

    const tempId = Date.now().toString();
    const optimisticItem: CommentItem = {
      id: tempId,
      userName: currentUser?.name || 'عمار الناصري',
      avatar:
        currentUser?.avatar ||
        'https://lh3.googleusercontent.com/aida/AEtjO1UqLVIEiU9HTEZwLj5XT18efMovYDsIt0odDPiQwRI-2kSKsB6LtCjmqPZKVvQ6hWVGxw8P1ll2jKa324hpg-MPBcPpyYNDTVuLhePTwl4fG2RHdUiiXdafOKHAnwXRb4iJN1-buVYoIF1ZMuRQlVpPuQnavyAGOiyfIp8UUtgnVtn3PcxcptuY9g7r3f6BgRGNIUCHpLP8UHcWOlrIU31Ad_Zalj5GaLbZgRWAI593ZFgg1EYzM0vqAko',
      isVip: currentUser?.isVip ?? true,
      timeAgo: 'الآن',
      content,
      likes: 0,
    };
    setComments((prev) => [optimisticItem, ...prev]);

    try {
      const res = await postEpisodeComment(epId, content);
      if (res?.id) {
        setComments((prev) =>
          prev.map((c) => (c.id === tempId ? { ...c, id: res.id } : c))
        );
      }
    } catch (_) {}
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
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* 1. Modal Header */}
        <WatchPlayerHeader
          onClose={handleClose}
          onShare={handleShare}
          isBookmarked={isBookmarked}
          onToggleBookmark={handleToggleBookmark}
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

