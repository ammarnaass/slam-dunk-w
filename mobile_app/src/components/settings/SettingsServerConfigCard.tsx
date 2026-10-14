import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { settingsStyles as styles } from './settings.styles';

interface SettingsServerConfigCardProps {
  customApi: string;
  onChangeCustomApi: (val: string) => void;
  onSaveApi: () => void;
}

export const SettingsServerConfigCard: React.FC<SettingsServerConfigCardProps> = ({
  customApi,
  onChangeCustomApi,
  onSaveApi,
}) => {
  return (
    <View style={styles.serverConfigCard}>
      <Text style={styles.serverConfigTitle}>عنوان خادم التطبيق (Backend API)</Text>
      <TextInput
        style={styles.serverInput}
        value={customApi}
        onChangeText={onChangeCustomApi}
        placeholder="http://10.0.2.2:3000/api/mobile/v1"
        placeholderTextColor="rgba(223, 226, 238, 0.4)"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.saveApiBtn} onPress={onSaveApi} activeOpacity={0.8}>
        <Text style={styles.saveApiBtnText}>حفظ وتطبيق الخادم</Text>
      </TouchableOpacity>
    </View>
  );
};
