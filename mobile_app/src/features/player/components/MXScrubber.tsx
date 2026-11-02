import React, { useState } from 'react';
import { View, Text, Pressable, LayoutChangeEvent } from 'react-native';
import { formatTime } from '../utils/player.utils';
import { hudStyles } from '../styles/hud.styles';

interface MXScrubberProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const MXScrubber: React.FC<MXScrubberProps> = ({
  currentTime,
  duration,
  onSeek,
}) => {
  const [trackWidth, setTrackWidth] = useState<number>(240);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0) {
      setTrackWidth(width);
    }
  };

  const handlePress = (locationX: number) => {
    const ratio = Math.max(0, Math.min(1, locationX / trackWidth));
    onSeek(ratio * duration);
  };

  return (
    <View style={hudStyles.scrubberRow}>
      <Text style={hudStyles.timeLabel}>{formatTime(currentTime)}</Text>
      <Pressable
        style={hudStyles.scrubberTrack}
        onLayout={handleLayout}
        onPress={(evt) => handlePress(evt.nativeEvent.locationX)}
      >
        <View style={hudStyles.scrubberBase}>
          <View style={[hudStyles.scrubberFill, { width: `${progressPercent}%` }]} />
        </View>
        <View style={[hudStyles.scrubberThumb, { left: `${progressPercent}%` }]} />
      </Pressable>
      <Text style={hudStyles.timeLabel}>{formatTime(duration)}</Text>
    </View>
  );
};
