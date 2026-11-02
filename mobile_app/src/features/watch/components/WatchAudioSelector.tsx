import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '../../../components/Icon';
import { AudioTrackType } from '../types/watch.types';
import { serversStyles } from '../styles/servers.styles';

interface WatchAudioSelectorProps {
  audioTrack: AudioTrackType;
  onChangeAudioTrack: (track: AudioTrackType) => void;
}

export const WatchAudioSelector: React.FC<WatchAudioSelectorProps> = ({
  audioTrack,
  onChangeAudioTrack,
}) => {
  return (
    <View style={serversStyles.audioSwitchRow}>
      <View style={serversStyles.audioSwitchLabel}>
        <Icon name="translate" size={16} color="#94A3B8" />
        <Text style={serversStyles.audioLabelText}>المسار الصوتي والترجمة</Text>
      </View>

      <View style={serversStyles.audioToggleCapsule}>
        <TouchableOpacity
          style={[
            serversStyles.audioToggleBtn,
            audioTrack === 'dub' && serversStyles.audioToggleBtnActive,
          ]}
          onPress={() => onChangeAudioTrack('dub')}
        >
          <Text
            style={[
              serversStyles.audioToggleText,
              audioTrack === 'dub' && serversStyles.audioToggleTextActive,
            ]}
          >
            دبلجة مركز الزهرة
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            serversStyles.audioToggleBtn,
            audioTrack === 'sub' && serversStyles.audioToggleBtnActive,
          ]}
          onPress={() => onChangeAudioTrack('sub')}
        >
          <Text
            style={[
              serversStyles.audioToggleText,
              audioTrack === 'sub' && serversStyles.audioToggleTextActive,
            ]}
          >
            مترجم أصلي
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
