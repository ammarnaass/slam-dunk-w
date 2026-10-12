import React from 'react';
import { View, Text } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './home.styles';

export const HomeTrustRibbon: React.FC = () => {
  return (
    <View style={styles.trustRibbon}>
      <View style={styles.trustItem}>
        <Icon name="bolt" size={15} color={THEME.colors.primaryContainer} filled />
        <Text style={styles.trustText}>سيرفرات فائقة السرعة</Text>
      </View>
      <View style={styles.trustDot} />
      <View style={styles.trustItem}>
        <Icon name="verified" size={15} color={THEME.colors.secondary} filled />
        <Text style={styles.trustText}>بدون إعلانات منبثقة</Text>
      </View>
      <View style={styles.trustDot} />
      <View style={styles.trustItem}>
        <Icon name="cloud_sync" size={15} color={THEME.colors.primaryContainer} filled />
        <Text style={styles.trustText}>تزامن فوري للمشاهدة</Text>
      </View>
    </View>
  );
};
