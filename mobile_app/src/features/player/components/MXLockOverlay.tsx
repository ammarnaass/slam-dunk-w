import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '../../../components/Icon';
import { hudStyles } from '../styles/hud.styles';

interface MXLockOverlayProps {
  isLocked: boolean;
  onToggleLock: () => void;
}

export const MXLockOverlay: React.FC<MXLockOverlayProps> = ({
  isLocked,
  onToggleLock,
}) => {
  const [unlockPromptVisible, setUnlockPromptVisible] = useState(false);

  if (!isLocked) return null;

  return (
    <View style={hudStyles.lockedContainer} pointerEvents="box-none">
      <TouchableOpacity
        style={hudStyles.floatingLockBtn}
        onPress={() => {
          setUnlockPromptVisible(true);
          setTimeout(() => setUnlockPromptVisible(false), 2200);
        }}
        activeOpacity={0.8}
      >
        <Icon name="lock" size={24} color="#FF6B00" />
      </TouchableOpacity>

      {unlockPromptVisible && (
        <View style={hudStyles.unlockPromptBox}>
          <Text style={hudStyles.unlockPromptText}>الشاشة مقفلة 🔒</Text>
          <TouchableOpacity
            style={hudStyles.unlockActionBtn}
            onPress={onToggleLock}
            activeOpacity={0.8}
          >
            <Text style={hudStyles.unlockActionBtnText}>إلغاء القفل الآن 🔓</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
