import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Episode } from '../types';
import {
  episodeCardStyles as styles,
  EpisodeThumbnail,
  EpisodeMeta,
  EpisodeAction,
} from './episodes';

interface EpisodeCardProps {
  episode: Episode;
  onPress: (episode: Episode) => void;
  isPlaying?: boolean;
  isFree?: boolean;
  isVip?: boolean;
  progress?: number; // 0 to 1
  showDownload?: boolean;
}

const DEFAULT_FALLBACK_THUMBNAIL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAa22K0JBF4QhJ9mQXDk9PkD67Tc79VEHj2z4D7680YXWv4h0BrZUMWmriKAZtuJZyAu0oP6ub8gtma9AAzrDc2zZ_Cw2GPx8mF4-GT_SvOcLLq_pI86EABgDazcY7cNSxC7U16BzgYin3GgZ3btJSryGdduw4tYlK4NFw3BnAv0J7B5YgRhmfulyYUtXtDSuIC2WImPmXZ7mOSbPIi3PhtZ2osA_RcaqUqM5yEMjpE36kArz0tDWYT';

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  onPress,
  isPlaying = false,
  isFree,
  isVip,
  progress,
  showDownload = false,
}) => {
  const epNum = episode.episode_number || episode.episodeNumber || 1;
  const freeEpisode = isFree ?? epNum <= 2;
  const vipRequired = isVip ?? epNum > 2;
  const durationText = episode.duration || '24:10';
  const thumbnailUri =
    episode.thumbnail || episode.animeCover || DEFAULT_FALLBACK_THUMBNAIL;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isPlaying ? styles.containerActive : styles.containerNormal,
      ]}
      onPress={() => onPress(episode)}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`الحلقة ${epNum}: ${episode.title}`}
    >
      {/* 16:9 Thumbnail Frame */}
      <EpisodeThumbnail
        thumbnailUri={thumbnailUri}
        vipRequired={vipRequired}
        isPlaying={isPlaying}
        durationText={durationText}
        progress={progress}
      />

      {/* Episode Metadata */}
      <EpisodeMeta
        epNum={epNum}
        isPlaying={isPlaying}
        freeEpisode={freeEpisode}
        vipRequired={vipRequired}
        title={episode.title}
      />

      {/* Trailing Action */}
      <EpisodeAction
        showDownload={showDownload}
        vipRequired={vipRequired}
      />
    </TouchableOpacity>
  );
};
