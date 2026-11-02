import React, { useState, useMemo } from 'react';
import { View, Modal, ScrollView, StatusBar, Share } from 'react-native';
import { useAppStore } from '../../../store/useAppStore';
import { WatchModalProps } from '../types/watch.types';
import { parseDurationToSeconds } from '../utils/watch.utils';
import { useWatchServers } from '../hooks/useWatchServers';
import { useWatchProgress } from '../hooks/useWatchProgress';
import { useWatchComments } from '../hooks/useWatchComments';
import { WatchPlayerHeader } from './WatchPlayerHeader';
import { WatchPrimaryActions } from './WatchPrimaryActions';
import { WatchServersPanel } from './WatchServersPanel';
import { WatchEpisodeInfo } from './WatchEpisodeInfo';
import { WatchCommentsPanel } from './WatchCommentsPanel';
import { WatchFullscreenPlayer } from './WatchFullscreenPlayer';
import { modalStyles } from '../styles/modal.styles';

export const WatchModal: React.FC<WatchModalProps> = ({
  visible,
  episode,
  onClose,
  onNextEpisode,
}) => {
  const { favorites, toggleFavorite, episodes, setSelectedEpisode, syncProgress } =
    useAppStore();

  const [isMXPlayerOpen, setIsMXPlayerOpen] = useState(false);
  const [isPlaying] = useState(false);

  const epId = episode?.id || '';
  const epNum = episode?.episode_number || episode?.episodeNumber || 47;
  const nextEpNum = epNum + 1;
  const totalDurationSeconds = useMemo(
    () => parseDurationToSeconds(episode?.duration),
    [episode?.duration]
  );

  const {
    episodeServers,
    selectedServer,
    setSelectedServer,
    activeServer,
    audioTrack,
    setAudioTrack,
  } = useWatchServers(episode);

  const { positionSeconds, setPositionSeconds, forceSync } = useWatchProgress({
    episodeId: epId,
    totalDurationSeconds,
    visible,
    isPlaying,
  });

  const {
    comments,
    newComment,
    setNewComment,
    handleSendComment,
    handleToggleLike,
  } = useWatchComments(epId, visible);

  const isBookmarked = useMemo(() => {
    if (!epId) return false;
    return favorites.some((f) => (typeof f === 'string' ? f === epId : f?.id === epId));
  }, [favorites, epId]);

  if (!episode) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `أشاهد الحلقة ${epNum} من سلام دانك على ANIME DAZE: https://slam-dunk-w.vercel.app`,
      });
    } catch (_) {}
  };

  const handleClose = () => {
    forceSync();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={modalStyles.container}>
        <StatusBar barStyle="light-content" />

        <WatchPlayerHeader
          onClose={handleClose}
          onShare={handleShare}
          isBookmarked={isBookmarked}
          onToggleBookmark={() => toggleFavorite('episode', epId)}
        />

        <ScrollView
          style={modalStyles.scrollBody}
          contentContainerStyle={modalStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <WatchPrimaryActions
            activeServer={activeServer}
            episodeTitle={episode.title}
            onOpenMXPlayer={() => setIsMXPlayerOpen(true)}
          />

          <WatchServersPanel
            servers={episodeServers}
            selectedServer={selectedServer}
            onSelectServer={setSelectedServer}
            audioTrack={audioTrack}
            onChangeAudioTrack={setAudioTrack}
          />

          <WatchEpisodeInfo
            episode={episode}
            epNum={epNum}
            nextEpNum={nextEpNum}
            onNextEpisode={onNextEpisode}
            onShare={handleShare}
          />

          <View style={modalStyles.sectionDivider} />

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

      <WatchFullscreenPlayer
        visible={isMXPlayerOpen}
        episode={episode}
        allEpisodes={episodes}
        videoUrl={activeServer?.url || ''}
        serverName={activeServer?.name || 'سيرفر ميجا السريع'}
        onClose={() => setIsMXPlayerOpen(false)}
        onEpisodeChange={(newEp) => {
          if (setSelectedEpisode) setSelectedEpisode(newEp);
        }}
        onProgressUpdate={(cur, dur) => {
          setPositionSeconds(cur);
          if (dur > 0 && Math.floor(cur) % 15 === 0) {
            syncProgress(episode.id, cur, dur);
          }
        }}
      />
    </Modal>
  );
};
