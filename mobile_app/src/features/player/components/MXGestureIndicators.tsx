import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from '../../../components/Icon';
import { ActiveGestureType } from '../types/player.types';
import { formatTime } from '../utils/player.utils';
import { gestureStyles } from '../styles/gesture.styles';

interface MXGestureIndicatorsProps {
  activeGesture: ActiveGestureType;
  volume: number;
  brightness: number;
  seekOffset: number;
  currentTime: number;
  duration: number;
}

export const MXGestureIndicators: React.FC<MXGestureIndicatorsProps> = ({
  activeGesture,
  volume,
  brightness,
  seekOffset,
  currentTime,
  duration,
}) => {
  const previewTime = Math.max(0, Math.min(duration, currentTime + seekOffset));

  return (
    <>
      {/* Screen Dimmer according to Brightness */}
      <View
        pointerEvents="none"
        style={[
          gestureStyles.brightnessDimmer,
          { opacity: (1 - brightness) * 0.72 },
        ]}
      />

      {/* Volume Feedback Pill */}
      {activeGesture === 'volume' && (
        <View style={gestureStyles.feedbackPill}>
          <Icon name={volume === 0 ? 'volume_mute' : 'volume_up'} size={28} color="#FFF" />
          <View style={gestureStyles.gaugeTrack}>
            <View
              style={[
                gestureStyles.gaugeFill,
                { width: `${Math.round(volume * 100)}%`, backgroundColor: '#FF6B00' },
              ]}
            />
          </View>
          <Text style={gestureStyles.feedbackText}>{Math.round(volume * 100)}%</Text>
        </View>
      )}

      {/* Brightness Feedback Pill */}
      {activeGesture === 'brightness' && (
        <View style={gestureStyles.feedbackPill}>
          <Icon name="brightness" size={28} color="#FFD700" />
          <View style={gestureStyles.gaugeTrack}>
            <View
              style={[
                gestureStyles.gaugeFill,
                { width: `${Math.round(brightness * 100)}%`, backgroundColor: '#FFD700' },
              ]}
            />
          </View>
          <Text style={gestureStyles.feedbackText}>{Math.round(brightness * 100)}%</Text>
        </View>
      )}

      {/* Seek Feedback Pill */}
      {activeGesture === 'seek' && (
        <View style={gestureStyles.seekPill}>
          <Text
            style={[
              gestureStyles.seekDeltaText,
              { color: seekOffset >= 0 ? '#4ADE80' : '#F87171' },
            ]}
          >
            {seekOffset >= 0 ? `+${seekOffset}s` : `${seekOffset}s`}
          </Text>
          <Text style={gestureStyles.seekTimeText}>
            [{formatTime(previewTime)} / {formatTime(duration)}]
          </Text>
        </View>
      )}
    </>
  );
};
