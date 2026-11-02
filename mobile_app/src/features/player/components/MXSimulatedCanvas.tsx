import React from 'react';
import { View, Text, Image } from 'react-native';
import { AspectRatioMode } from '../types/player.types';
import { playerStyles } from '../styles/player.styles';

interface MXSimulatedCanvasProps {
  thumbnail?: string;
  aspectRatio: AspectRatioMode;
}

export const MXSimulatedCanvas: React.FC<MXSimulatedCanvasProps> = ({
  thumbnail,
  aspectRatio,
}) => {
  const resizeMode =
    aspectRatio === 'stretch'
      ? 'stretch'
      : aspectRatio === 'cover'
      ? 'cover'
      : 'contain';

  return (
    <View style={playerStyles.simulatedContainer}>
      <Image
        source={{ uri: thumbnail || '/logoep.jpg' }}
        style={playerStyles.simulatedPoster}
        resizeMode={resizeMode}
      />
      <View style={playerStyles.simulatedScrim}>
        <View style={playerStyles.simulatedLivePill}>
          <View style={playerStyles.liveDot} />
          <Text style={playerStyles.simulatedLiveText}>
            مشغل MX Player السينمائي (بث فائق 1080p)
          </Text>
        </View>
      </View>
    </View>
  );
};
