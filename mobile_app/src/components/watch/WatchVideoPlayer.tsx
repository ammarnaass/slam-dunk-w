import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './watch.styles';

interface WatchVideoPlayerProps {
  thumbnailUrl?: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const WatchVideoPlayer: React.FC<WatchVideoPlayerProps> = ({
  thumbnailUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMPVNR4ix76vzObnfVl-_p9CUq0Lh9p40E21mNoEN8WXID79OT4iIDMlpJq-OwOOshargraXFmTOJ5GDo0DinsBgvSWKsos0klNKgwvyCVkVyQ5MmQzQPlhTy8X6x74nNjEl80PxCHj7zRirprKdR3QtSaRaNEXQHNtoGRAtEv1eiiA5YjiQ4OqN_XIIKPua84NEE0peAb1K3swIuKif5EqdRHWEiAAkUkUhZuYxvXX7LBRKSvJ4iH',
  isPlaying,
  onTogglePlay,
}) => {
  return (
    <View style={styles.playerFrame}>
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.playerPoster}
        resizeMode="cover"
      />
      {/* Scrim Gradient */}
      <View style={styles.playerScrim} />

      {/* Top Live Badges */}
      <View style={styles.playerTopBar}>
        <View style={styles.liveIndicatorRow}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>بث فائق الدقة</Text>
          </View>
          <View style={styles.qualityTag}>
            <Text style={styles.qualityTagText}>1080p FHD</Text>
          </View>
        </View>

        <View style={styles.playerSettingsBtn}>
          <Icon name="settings" size={18} color={THEME.colors.onSurface} />
        </View>
      </View>

      {/* Center Play/Pause Trigger */}
      <TouchableOpacity
        style={styles.centerPlayBtn}
        onPress={onTogglePlay}
        activeOpacity={0.9}
      >
        <Icon
          name={isPlaying ? 'pause' : 'play_arrow'}
          size={30}
          color={THEME.colors.onPrimaryContainer}
          filled
        />
      </TouchableOpacity>

      {/* Bottom Controls Bar */}
      <View style={styles.playerBottomControls}>
        {/* Progress Bar */}
        <View style={styles.playerProgressBar}>
          <View style={[styles.playerProgressFill, { width: '61%' }]} />
        </View>

        {/* Controls Row */}
        <View style={styles.controlsRow}>
          <View style={styles.controlsLeft}>
            <TouchableOpacity onPress={onTogglePlay}>
              <Icon
                name={isPlaying ? 'pause' : 'play_arrow'}
                size={20}
                color={THEME.colors.onSurface}
                filled
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Icon name="replay_10" size={18} color={THEME.colors.onSurfaceVariant} />
            </TouchableOpacity>

            <TouchableOpacity>
              <Icon name="forward_10" size={18} color={THEME.colors.onSurfaceVariant} />
            </TouchableOpacity>

            <Text style={styles.timerText}>
              14:32 <Text style={styles.timerSlash}>/</Text> 23:45
            </Text>
          </View>

          <View style={styles.controlsRight}>
            <Icon name="volume_up" size={18} color={THEME.colors.onSurfaceVariant} />
            <Icon name="fullscreen" size={18} color={THEME.colors.onSurface} />
          </View>
        </View>
      </View>
    </View>
  );
};
