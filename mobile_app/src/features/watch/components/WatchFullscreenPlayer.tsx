import React from 'react';
import { Modal, StatusBar } from 'react-native';
import { Episode } from '../../../types';
import { MXVideoPlayer } from '../../player';

interface WatchFullscreenPlayerProps {
  visible: boolean;
  episode: Episode | null;
  allEpisodes: Episode[];
  videoUrl: string;
  serverName: string;
  onClose: () => void;
  onEpisodeChange?: (newEpisode: Episode) => void;
  onProgressUpdate?: (currentTime: number, duration: number) => void;
}

export const WatchFullscreenPlayer: React.FC<WatchFullscreenPlayerProps> = ({
  visible,
  episode,
  allEpisodes,
  videoUrl,
  serverName,
  onClose,
  onEpisodeChange,
  onProgressUpdate,
}) => {
  if (!visible || !episode) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar hidden />
      <MXVideoPlayer
        episode={episode}
        allEpisodes={allEpisodes}
        videoUrl={videoUrl}
        serverName={serverName}
        onClose={onClose}
        onEpisodeChange={onEpisodeChange}
        onProgressUpdate={onProgressUpdate}
      />
    </Modal>
  );
};
