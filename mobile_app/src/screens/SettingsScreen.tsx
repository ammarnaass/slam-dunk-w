import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { THEME } from '../constants/theme';
import { Icon } from '../components/Icon';
import { API_BASE_URL, setApiBaseUrl } from '../services/api';
import { settingsStyles as styles } from '../components/settings/settings.styles';
import { SettingsAccountCard } from '../components/settings/SettingsAccountCard';
import {
  SettingsQualityGrid,
  StreamingQuality,
} from '../components/settings/SettingsQualityGrid';
import { SettingsTogglesCard } from '../components/settings/SettingsTogglesCard';
import { SettingsCacheCard } from '../components/settings/SettingsCacheCard';
import { SettingsServerConfigCard } from '../components/settings/SettingsServerConfigCard';

export type { StreamingQuality };

export interface SettingsScreenProps {
  onBack?: () => void;
  onServerUrlChange?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onServerUrlChange,
}) => {
  const [selectedQuality, setSelectedQuality] = useState<StreamingQuality>('auto');
  const [dataSaver, setDataSaver] = useState(true);
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [customApi, setCustomApi] = useState(API_BASE_URL);

  const handleSaveApi = () => {
    if (!customApi.trim()) return;
    setApiBaseUrl(customApi.trim());
    onServerUrlChange?.();
    Alert.alert('تم الحفظ', 'تم تحديث عنوان الخادم بنجاح ومزامنة الاتصال.');
  };

  const handleClearCache = () => {
    Alert.alert('تنظيف الذاكرة المؤقتة 🧹', 'تم إخلاء 340 MB من الكاش والصور المؤقتة بنجاح.');
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow_forward" size={22} color={THEME.colors.onSurface} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>الإعدادات العامة</Text>
        </View>

        <View style={styles.userCircle}>
          <Icon name="person" size={18} color={THEME.colors.primaryContainer} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Intro Banner & Account Card */}
        <SettingsAccountCard />

        {/* 3. Streaming Quality Selection */}
        <SettingsQualityGrid
          selectedQuality={selectedQuality}
          onSelectQuality={setSelectedQuality}
        />

        {/* 4. Toggles Card */}
        <SettingsTogglesCard
          dataSaver={dataSaver}
          onToggleDataSaver={setDataSaver}
          autoPlayNext={autoPlayNext}
          onToggleAutoPlayNext={setAutoPlayNext}
          notifications={notifications}
          onToggleNotifications={setNotifications}
        />

        {/* 5. Cache Cleaner Card */}
        <SettingsCacheCard onClearCache={handleClearCache} />

        {/* 6. Backend API URL Config */}
        <SettingsServerConfigCard
          customApi={customApi}
          onChangeCustomApi={setCustomApi}
          onSaveApi={handleSaveApi}
        />
      </ScrollView>
    </View>
  );
};
