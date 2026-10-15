import React from 'react';
import { View, Text, Modal, TouchableOpacity, Linking } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from '../../app.styles';
import { AppConfig } from '../../types';

interface ForceUpdateModalProps {
  visible: boolean;
  appConfig: AppConfig | null;
}

export const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({ visible, appConfig }) => {
  const handleUpdate = () => {
    const url =
      appConfig?.version_control?.direct_apk_url ||
      appConfig?.version_control?.store_url;
    if (url) Linking.openURL(url);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.updateModalOverlay}>
        <View style={styles.updateCard}>
          <View style={styles.updateIconCircle}>
            <Icon
              name="sparkles"
              size={34}
              color={THEME.colors.primaryContainer}
              filled
            />
          </View>
          <Text style={styles.updateTitle}>تحديث إجباري جديد متاح!</Text>
          <Text style={styles.updateMsg}>
            يتوفر إصدار أحدث ({appConfig?.version_control?.latest_version || '1.2.0'}) يحتوي على تحسينات هامة لسيرفرات البث وجودة الفيديو. يرجى التحديث للمتابعة.
          </Text>

          <TouchableOpacity
            style={styles.updateBtn}
            onPress={handleUpdate}
            activeOpacity={0.8}
          >
            <Icon name="download" size={16} color="#FFFFFF" />
            <Text style={styles.updateBtnText}>تحميل التحديث الآن</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
