import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Modal,
  ScrollView,
  Share,
  StatusBar,
  TouchableOpacity,
  Text,
  Linking,
  StyleSheet,
  Alert,
} from 'react-native';
import { Episode } from '../types';
import { styles } from '../components/watch/watch.styles';
import { INITIAL_COMMENTS, SERVERS, CommentItem } from '../constants/watch-data';
import { WatchPlayerHeader } from '../components/watch/WatchPlayerHeader';
import { WatchVideoPlayer } from '../components/watch/WatchVideoPlayer';
import { WatchServersPanel } from '../components/watch/WatchServersPanel';
import { WatchEpisodeInfo } from '../components/watch/WatchEpisodeInfo';
import { WatchCommentsPanel } from '../components/watch/WatchCommentsPanel';
import { Icon } from '../components/Icon';
import { THEME } from '../constants/theme';
import { useAppStore } from '../store/useAppStore';
import { fetchEpisodeComments, postEpisodeComment } from '../services/api';
import { MXVideoPlayer } from '../components/player/MXVideoPlayer';

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
    episodes,
    setSelectedEpisode,
  } = useAppStore();

  const [isMXPlayerOpen, setIsMXPlayerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedServer, setSelectedServer] = useState('s1');
  const [audioTrack, setAudioTrack] = useState<'dub' | 'sub'>('dub');
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [positionSeconds, setPositionSeconds] = useState(0);

  const epId = episode?.id || '';
  const totalDurationSeconds = useMemo(() => parseDurationToSeconds(episode?.duration), [episode?.duration]);

  // Real servers from episode data with fallback to multi-server matrix
  const episodeServers = useMemo(() => {
    const rawList = episode?.watchServers && episode.watchServers.length > 0
      ? episode.watchServers
      : episode?.servers && episode.servers.length > 0
      ? episode.servers
      : episode?.mega_link
      ? [{ id: 'srv-mega', name: 'سيرفر ميجا الخارق', url: episode.mega_link, quality: '1080p FHD' }]
      : SERVERS;

    return rawList.map((s: any, idx: number) => ({
      id: s.id || `srv-${idx}`,
      name: s.name || `سيرفر ${idx + 1}`,
      desc: s.quality || '1080p FHD',
      url: s.directUrl || s.url,
      downloadUrl: s.downloadUrl || s.url,
      category: s.category || 'streaming',
      matrixCategory: s.matrixCategory || 'direct',
      provider: s.provider || 'custom',
      ping: s.ping || (idx === 0 ? '18ms' : idx === 1 ? '24ms' : '36ms'),
      isWorking: s.isWorking ?? true,
    }));
  }, [episode]);

  useEffect(() => {
    if (episodeServers.length > 0) {
      setSelectedServer(episodeServers[0].id);
    }
  }, [episodeServers]);

  const handleAutoFailover = () => {
    const nextServer = episodeServers.find((s: any) => s.id !== selectedServer && s.isWorking !== false);
    if (nextServer) {
      setSelectedServer(nextServer.id);
      Alert.alert(
        '🔄 تبديل تلقائي (Zero-Buffering)',
        `تم تحويل البث تلقائياً إلى "${nextServer.name}" لاستمرار المشاهدة دون انقطاع.`
      );
    }
  };

  const activeServer = useMemo(() => {
    return episodeServers.find((s: any) => s.id === selectedServer) || episodeServers[0];
  }, [episodeServers, selectedServer]);

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
            videoUrl={activeServer?.url}
            serverName={activeServer?.name}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsMXPlayerOpen(true)}
            positionSeconds={positionSeconds}
            totalDurationSeconds={totalDurationSeconds}
            onAutoFailover={handleAutoFailover}
          />

          {/* Primary MX Player Launch Button */}
          <View style={localWatchStyles.primaryActionContainer}>
            <TouchableOpacity
              style={localWatchStyles.mxPlayerBtn}
              onPress={() => setIsMXPlayerOpen(true)}
              activeOpacity={0.88}
            >
              <Icon name="play" size={22} color="#FFFFFF" />
              <Text style={localWatchStyles.mxPlayerBtnText}>
                🎬 تشغيل بمشغل MX Player (إيماءات + صوت + سطوع)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Primary Watch Action Button */}
          {activeServer?.url ? (
            <View style={localWatchStyles.primaryActionContainer}>
              <TouchableOpacity
                style={localWatchStyles.startWatchingBtn}
                onPress={() => {
                  Alert.alert(
                    '🎬 تشغيل الحلقة',
                    `سيرفر: ${activeServer.name || 'سيرفر ميجا السريع'}\nالجودة: 1080p FHD\n\nاختر طريقة المشاهدة المفضلة:`,
                    [
                      {
                        text: '🚀 فتح في تطبيق MEGA / المتصفح',
                        onPress: async () => {
                          try {
                            await Linking.openURL(activeServer.url);
                          } catch (_) {
                            Alert.alert('تنبيه', 'لم يتم العثور على متصفح أو تطبيق متوافق على هذا الجهاز.');
                          }
                        },
                      },
                      {
                        text: '📋 نسخ / مشاركة الرابط',
                        onPress: () => {
                          Share.share({
                            title: `مشاهدة ${episode.title}`,
                            message: activeServer.url,
                            url: activeServer.url,
                          });
                        },
                      },
                      { text: 'إلغاء', style: 'cancel' },
                    ]
                  );
                }}
                activeOpacity={0.88}
              >
                <Icon name="rocket_launch" size={20} color="#FFFFFF" />
                <Text style={localWatchStyles.startWatchingText}>
                  تشغيل الحلقة الآن ({activeServer.name || 'سيرفر ميجا السريع'})
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* 3. Streaming Servers Preference Panel */}
          <WatchServersPanel
            servers={episodeServers}
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

      {/* Fullscreen MX Player Experience */}
      {isMXPlayerOpen && episode && (
        <Modal
          visible={isMXPlayerOpen}
          animationType="fade"
          presentationStyle="fullScreen"
          onRequestClose={() => setIsMXPlayerOpen(false)}
        >
          <StatusBar hidden />
          <MXVideoPlayer
            episode={episode}
            allEpisodes={episodes}
            videoUrl={activeServer?.url || ''}
            serverName={activeServer?.name || 'سيرفر ميجا السريع'}
            onClose={() => setIsMXPlayerOpen(false)}
            onEpisodeChange={(newEp) => {
              if (setSelectedEpisode) {
                setSelectedEpisode(newEp);
              }
            }}
            onProgressUpdate={(cur, dur) => {
              setPositionSeconds(cur);
              if (dur > 0 && Math.floor(cur) % 15 === 0) {
                syncProgress(episode.id, cur, dur);
              }
            }}
          />
        </Modal>
      )}
    </Modal>
  );
};

const localWatchStyles = StyleSheet.create({
  primaryActionContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 2,
  },
  mxPlayerBtn: {
    backgroundColor: '#E63946',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 8,
  },
  mxPlayerBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  startWatchingBtn: {
    backgroundColor: THEME.colors.primaryContainer,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  startWatchingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

