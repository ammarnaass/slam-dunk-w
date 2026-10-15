import React from 'react';
import { View } from 'react-native';
import { Icon } from '../Icon';
import { THEME } from '../../constants/theme';
import { episodeCardStyles as styles } from './episode-card.styles';

interface EpisodeActionProps {
  showDownload?: boolean;
  vipRequired?: boolean;
}

export const EpisodeAction: React.FC<EpisodeActionProps> = ({
  showDownload,
  vipRequired,
}) => {
  return (
    <View style={styles.actionSection}>
      {showDownload ? (
        <View style={styles.actionCircle}>
          <Icon name="download" size={18} color={THEME.colors.onSurfaceVariant} />
        </View>
      ) : vipRequired ? (
        <View style={styles.actionCircleVip}>
          <Icon name="lock_open" size={18} color={THEME.colors.secondary} />
        </View>
      ) : (
        <View style={styles.actionCircle}>
          <Icon name="more_vert" size={18} color={THEME.colors.onSurfaceVariant} />
        </View>
      )}
    </View>
  );
};
