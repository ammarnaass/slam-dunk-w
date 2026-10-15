import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from '../../app.styles';
import { AppConfig } from '../../types';

interface MaintenanceModalProps {
  visible: boolean;
  appConfig: AppConfig | null;
  devBypassCode: string;
  setDevBypassCode: (code: string) => void;
  onBypassSuccess: () => void;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  visible,
  appConfig,
  devBypassCode,
  setDevBypassCode,
  onBypassSuccess,
}) => {
  const handleBypass = () => {
    const expectedKey = appConfig?.maintenance?.dev_bypass_key;
    if (__DEV__ && (!expectedKey || devBypassCode.trim() === 'DEV')) {
      onBypassSuccess();
      return;
    }
    if (expectedKey && devBypassCode.trim() === expectedKey) {
      onBypassSuccess();
    } else {
      Alert.alert('تنبيه', 'كود المطور غير صحيح أو الصيانة إلزامية');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View style={styles.maintenanceContainer}>
        <View style={styles.maintenanceCard}>
          <View style={styles.maintenanceIconCircle}>
            <Icon name="tool" size={32} color={THEME.colors.secondaryContainer} />
          </View>
          <Text style={styles.maintenanceTitle}>
            {appConfig?.maintenance?.title || 'صيانة دورية مجدولة'}
          </Text>
          <Text style={styles.maintenanceMsg}>
            {appConfig?.maintenance?.message ||
              'نقوم حالياً بتحسين وتحديث سيرفرات المشاهدة لتوفير تجربة أسرع وأعلى جودة بدون تقطيع. سنعود خلال وقت قصير!'}
          </Text>

          {appConfig?.maintenance?.estimated_end_time && (
            <View style={styles.timePill}>
              <Text style={styles.timeText}>
                الموعد المتوقع: {appConfig.maintenance.estimated_end_time}
              </Text>
            </View>
          )}

          {/* Dev Bypass Section */}
          <View style={styles.devBypassBox}>
            <Text style={styles.devBypassLabel}>تخطي الصيانة لفريق التطوير:</Text>
            <View style={styles.bypassRow}>
              <TextInput
                style={styles.bypassInput}
                placeholder="أدخل كود المطور..."
                placeholderTextColor={THEME.colors.onSurfaceVariant}
                value={devBypassCode}
                onChangeText={setDevBypassCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.bypassBtn}
                onPress={handleBypass}
                activeOpacity={0.8}
              >
                <Text style={styles.bypassBtnText}>دخول</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
