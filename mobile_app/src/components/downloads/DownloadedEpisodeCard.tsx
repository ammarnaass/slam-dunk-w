import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { DownloadedEpisodeItem } from '../../constants/downloads-data';
import { Episode } from '../../types';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './downloads.styles';

interface DownloadedEpisodeCardProps {
  item: DownloadedEpisodeItem;
  isSelected: boolean;
  isMultiSelectMode: boolean;
  onToggleSelect: (id: string) => void;
  onPlayEpisode: (episode: Episode) => void;
  onDeleteItem: (id: string) => void;
}

export const DownloadedEpisodeCard: React.FC<DownloadedEpisodeCardProps> = ({
  item,
  isSelected,
  isMultiSelectMode,
  onToggleSelect,
  onPlayEpisode,
  onDeleteItem,
}) => {
  const handlePress = () => {
    if (isMultiSelectMode) {
      onToggleSelect(item.id);
    } else {
      const episodeObj: Episode = {
        id: item.id,
        title: item.title,
        episode_number: item.episodeNumber,
        thumbnail: item.thumbnail,
        animeId: item.seriesId,
        animeTitle: item.series,
      };
      onPlayEpisode(episodeObj);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.episodeRow,
        isSelected && styles.episodeRowSelected,
      ]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {/* Checkbox */}
      {isMultiSelectMode && (
        <TouchableOpacity
          style={[
            styles.checkboxBtn,
            isSelected && styles.checkboxBtnSelected,
          ]}
          onPress={() => onToggleSelect(item.id)}
          activeOpacity={0.7}
        >
          <Icon
            name={isSelected ? 'check_box' : 'check_box_outline_blank'}
            size={18}
            color={
              isSelected
                ? THEME.colors.primaryContainer
                : THEME.colors.onSurfaceVariant
            }
          />
        </TouchableOpacity>
      )}

      {/* Thumbnail & Badges */}
      <View style={styles.thumbContainer}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbImage}
          resizeMode="cover"
        />
        <View style={styles.thumbVignette} />
        <View style={styles.epNumberTag}>
          <Text style={styles.epNumberText}>ح {item.episodeNumber}</Text>
        </View>
        <View
          style={[
            styles.qualityTag,
            item.qualityTag === 'HD' && styles.qualityTagHD,
          ]}
        >
          <Text style={styles.qualityTagText}>{item.qualityTag}</Text>
        </View>
      </View>

      {/* Episode Info */}
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.episodeMetaRow}>
          <Text style={styles.episodeMetaText}>{item.quality}</Text>
          <Text style={styles.episodeMetaDot}>•</Text>
          <Text style={styles.episodeSizeText}>{item.sizeMB} MB</Text>
          <Text style={styles.episodeMetaDot}>•</Text>
          <Text style={styles.episodeMetaText}>{item.downloadedAt}</Text>
        </View>

        {/* Watch Status or Progress */}
        {item.watchedPercentage === 100 ? (
          <View style={styles.watchedStatusRow}>
            <Icon
              name="check_circle"
              size={13}
              color={THEME.colors.secondary}
              filled
            />
            <Text style={styles.watchedStatusText}>تمت المشاهدة (100%)</Text>
          </View>
        ) : item.watchedPercentage > 0 ? (
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${item.watchedPercentage}%` },
              ]}
            />
          </View>
        ) : (
          <Text style={styles.notStartedText}>لم تبدأ بعد</Text>
        )}
      </View>

      {/* Delete Action Button */}
      <TouchableOpacity
        style={styles.deleteSingleBtn}
        onPress={() => onDeleteItem(item.id)}
        activeOpacity={0.7}
        accessibilityLabel="حذف الحلقة"
      >
        <Icon name="delete" size={18} color={THEME.colors.onSurfaceVariant} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
