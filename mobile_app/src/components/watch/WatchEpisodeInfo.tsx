import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { THEME } from '../../constants/theme';
import { Episode } from '../../types';
import { Icon } from '../Icon';
import { styles } from './watch.styles';

interface WatchEpisodeInfoProps {
  episode: Episode;
  epNum: number;
  nextEpNum: number;
  onNextEpisode?: () => void;
  onShare: () => void;
}

export const WatchEpisodeInfo: React.FC<WatchEpisodeInfoProps> = ({
  episode,
  epNum,
  nextEpNum,
  onNextEpisode,
  onShare,
}) => {
  return (
    <View style={styles.episodeInfoPanel}>
      <View style={styles.infoTagsRow}>
        <View style={styles.seasonTag}>
          <Text style={styles.seasonTagText}>موسم 1</Text>
        </View>
        <View style={styles.genreTag}>
          <Text style={styles.genreTagText}>رياضي • شونين</Text>
        </View>
        <View style={styles.ratingTag}>
          <Icon name="star" size={14} color={THEME.colors.secondary} filled />
          <Text style={styles.ratingTagText}>9.6</Text>
        </View>
      </View>

      <Text style={styles.epMainTitle}>
        سلام دانك - الحلقة {epNum}: {episode.title || 'العزيمة النارية في الشوط الحاسم'}
      </Text>

      <Text style={styles.epSynopsis}>
        {episode.description ||
          'يشتعل التنافس بين الصقور والخصم اللدود مع بقاء دقيقتين فقط على صافرة النهاية؛ يتأهب حسان لتحقيق الارتداد التاريخي الحاسم تحت السلة وسط حماس الجماهير الملتهب.'}
      </Text>

      {/* Quick Actions Row */}
      <View style={styles.actionsBar}>
        {/* Next Episode CTA */}
        <TouchableOpacity
          style={styles.nextEpBtn}
          onPress={() => {
            if (onNextEpisode) onNextEpisode();
          }}
          activeOpacity={0.9}
        >
          <Text style={styles.nextEpText}>الحلقة التالية ({nextEpNum})</Text>
          <Icon name="arrow_forward" size={18} color={THEME.colors.onPrimaryContainer} />
        </TouchableOpacity>

        {/* Download */}
        <TouchableOpacity
          style={styles.downloadActionBtn}
          onPress={() =>
            Alert.alert('بدء التنزيل', `جاري تنزيل الحلقة ${epNum} بجودة 1080p`)
          }
          activeOpacity={0.8}
        >
          <Icon name="download" size={18} color={THEME.colors.onSurface} />
          <Text style={styles.downloadActionText}>تحميل</Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity
          style={styles.shareActionBtn}
          onPress={onShare}
          activeOpacity={0.8}
        >
          <Icon name="share" size={18} color={THEME.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
