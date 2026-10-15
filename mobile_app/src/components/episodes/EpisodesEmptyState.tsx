import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from '../Icon';
import { THEME } from '../../constants/theme';
import { episodesStyles as styles } from './episodes.styles';

export const EpisodesEmptyState: React.FC = () => {
  return (
    <View style={styles.emptyContainer}>
      <Icon
        name="sports_basketball"
        size={48}
        color={THEME.colors.onSurfaceVariant}
      />
      <Text style={styles.emptyTitle}>لم يتم العثور على أي حلقات</Text>
      <Text style={styles.emptyDesc}>
        تأكد من رقم الحلقة أو نص البحث وجرب نطاقاً آخر من الحلقات.
      </Text>
    </View>
  );
};
