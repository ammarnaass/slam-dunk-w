import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '../../../components/Icon';
import { PlayerBottomBarProps } from '../types/player.types';
import { MXScrubber } from './MXScrubber';
import { hudStyles } from '../styles/hud.styles';

export const MXBottomBar: React.FC<PlayerBottomBarProps> = ({
  currentTime,
  duration,
  isPlaying,
  playbackRate,
  onTogglePlay,
  onSeek,
  onSkipSeconds,
  onOpenEpisodesDrawer,
  onOpenSpeedModal,
  onNextEpisode,
  onPrevEpisode,
}) => {
  return (
    <View style={hudStyles.bottomBar}>
      <MXScrubber currentTime={currentTime} duration={duration} onSeek={onSeek} />

      <View style={hudStyles.controlsRow}>
        <TouchableOpacity
          style={hudStyles.iconControlBtn}
          onPress={onOpenEpisodesDrawer}
          activeOpacity={0.7}
        >
          <Icon name="view_agenda" size={22} color="#E2E8F0" />
          <Text style={hudStyles.controlSubText}>الحلقات</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={hudStyles.iconControlBtn}
          onPress={onOpenSpeedModal}
          activeOpacity={0.7}
        >
          <Text style={hudStyles.speedLabel}>{playbackRate}x</Text>
          <Text style={hudStyles.controlSubText}>السرعة</Text>
        </TouchableOpacity>

        {onPrevEpisode && (
          <TouchableOpacity
            style={hudStyles.iconControlBtn}
            onPress={onPrevEpisode}
            activeOpacity={0.7}
          >
            <Icon name="arrowRight" size={24} color="#FFF" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={hudStyles.iconControlBtn}
          onPress={() => onSkipSeconds(-10)}
          activeOpacity={0.7}
        >
          <Icon name="replay_10" size={24} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={hudStyles.mainPlayBtn}
          onPress={onTogglePlay}
          activeOpacity={0.85}
        >
          <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={hudStyles.iconControlBtn}
          onPress={() => onSkipSeconds(10)}
          activeOpacity={0.7}
        >
          <Icon name="forward_10" size={24} color="#FFF" />
        </TouchableOpacity>

        {onNextEpisode && (
          <TouchableOpacity
            style={hudStyles.iconControlBtn}
            onPress={onNextEpisode}
            activeOpacity={0.7}
          >
            <Icon name="arrowLeft" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
