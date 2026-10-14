import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { settingsStyles as styles } from './settings.styles';

interface SettingsCacheCardProps {
  onClearCache: () => void;
  cacheSizeText?: string;
}

export const SettingsCacheCard: React.FC<SettingsCacheCardProps> = ({
  onClearCache,
  cacheSizeText = '340 MB',
}) => {
  return (
    <TouchableOpacity
      style={styles.cacheCleanCard}
      onPress={onClearCache}
      activeOpacity={0.75}
    >
      <View style={styles.cacheCleanTexts}>
        <Icon name="cleaning_services" size={18} color={THEME.colors.secondary} />
        <Text style={styles.cacheCleanTitle}>ملفات مؤقتة وكاش متراكم ({cacheSizeText})</Text>
      </View>
      <View style={styles.cacheCleanAction}>
        <Icon name="auto_delete" size={15} color={THEME.colors.primaryContainer} />
        <Text style={styles.cacheCleanActionText}>تنظيف سريع</Text>
      </View>
    </TouchableOpacity>
  );
};
