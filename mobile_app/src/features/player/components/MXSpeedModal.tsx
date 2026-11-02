import React from 'react';
import { View, Text, TouchableOpacity, Pressable, FlatList } from 'react-native';
import { Icon } from '../../../components/Icon';
import { SPEED_OPTIONS } from '../constants/player.constants';
import { hudStyles } from '../styles/hud.styles';

interface MXSpeedModalProps {
  visible: boolean;
  currentRate: number;
  onSelectRate: (rate: number) => void;
  onClose: () => void;
}

export const MXSpeedModal: React.FC<MXSpeedModalProps> = ({
  visible,
  currentRate,
  onSelectRate,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <View style={hudStyles.speedOverlay}>
      <Pressable style={hudStyles.speedOverlay} onPress={onClose} />
      <View style={hudStyles.speedModalCard}>
        <Text style={hudStyles.speedTitle}>سرعة التشغيل (Playback Speed)</Text>
        <FlatList
          data={SPEED_OPTIONS}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => {
            const isActive = currentRate === item;
            return (
              <TouchableOpacity
                style={[hudStyles.speedOption, isActive && hudStyles.speedOptionActive]}
                onPress={() => {
                  onSelectRate(item);
                  onClose();
                }}
              >
                <Text style={[hudStyles.speedOptionText, isActive && hudStyles.speedOptionTextActive]}>
                  {item === 1.0 ? '1.0x (العادي)' : `${item}x`}
                </Text>
                {isActive && <Icon name="check" size={18} color="#FF6B00" />}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};
