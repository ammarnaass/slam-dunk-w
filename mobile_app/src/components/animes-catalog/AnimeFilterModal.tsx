import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { filterStyles as styles } from './filter.styles';
import { AudioFilterSection } from './AudioFilterSection';
import { GenreFilterSection } from './GenreFilterSection';
import { StatusFilterSection } from './StatusFilterSection';
import { QualityFilterSection } from './QualityFilterSection';
import { EraFilterSection } from './EraFilterSection';
import { SortFilterSection } from './SortFilterSection';

export {
  GENRE_OPTIONS,
  AUDIO_OPTIONS,
  QUALITY_OPTIONS,
  ERA_OPTIONS,
  SORT_OPTIONS,
  STATUS_OPTIONS,
} from '../../constants/filter-options';

export type {
  GenreOption,
  AudioOption,
  QualityOption,
  EraOption,
  SortOption,
  StatusOption,
} from '../../constants/filter-options';

export interface AnimeFilterModalProps {
  visible: boolean;
  onClose: () => void;
  activeFilterAudio: string;
  onChangeFilterAudio: (val: any) => void;
  activeFilterStatus: string;
  onChangeFilterStatus: (val: any) => void;
  selectedGenres?: string[];
  onToggleGenre?: (genre: string) => void;
  selectedQuality?: string;
  onChangeQuality?: (quality: string) => void;
  selectedEra?: string;
  onChangeEra?: (era: string) => void;
  selectedSort?: string;
  onChangeSort?: (sort: string) => void;
  onReset?: () => void;
  totalFilteredCount: number;
}

export const AnimeFilterModal: React.FC<AnimeFilterModalProps> = ({
  visible,
  onClose,
  activeFilterAudio,
  onChangeFilterAudio,
  activeFilterStatus,
  onChangeFilterStatus,
  selectedGenres = ['sports', 'shonen'],
  onToggleGenre,
  selectedQuality = '1080p',
  onChangeQuality,
  selectedEra = 'golden',
  onChangeEra,
  selectedSort = 'top_rated',
  onChangeSort,
  onReset,
  totalFilteredCount,
}) => {
  const [localGenres, setLocalGenres] = useState<string[]>(selectedGenres);
  const [localQuality, setLocalQuality] = useState<string>(selectedQuality);
  const [localEra, setLocalEra] = useState<string>(selectedEra);
  const [localSort, setLocalSort] = useState<string>(selectedSort);

  const toggleGenre = (genreId: string) => {
    if (onToggleGenre) {
      onToggleGenre(genreId);
    }
    setLocalGenres((prev) =>
      prev.includes(genreId) ? prev.filter((g) => g !== genreId) : [...prev, genreId]
    );
  };

  const handleQualitySelect = (q: string) => {
    if (onChangeQuality) onChangeQuality(q);
    setLocalQuality(q);
  };

  const handleEraSelect = (era: string) => {
    if (onChangeEra) onChangeEra(era);
    setLocalEra(era);
  };

  const handleSortSelect = (sort: string) => {
    if (onChangeSort) onChangeSort(sort);
    setLocalSort(sort);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onChangeFilterAudio('all');
      onChangeFilterStatus('all');
      setLocalGenres([]);
      setLocalQuality('1080p');
      setLocalEra('all');
      setLocalSort('top_rated');
    }
  };

  const activeCount =
    (activeFilterAudio !== 'all' ? 1 : 0) +
    (activeFilterStatus !== 'all' ? 1 : 0) +
    localGenres.length +
    (localQuality !== '1080p' ? 1 : 0) +
    (localEra !== 'all' ? 1 : 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          {/* Drag Handle */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitleRow}>
              <View style={styles.headerIconContainer}>
                <Icon name="tune" size={20} color={THEME.colors.primaryContainer} />
              </View>
              <View style={styles.headerTitles}>
                <Text style={styles.modalTitle}>تصفية متقدمة</Text>
                <Text style={styles.modalSubtitle}>تخصيص أرشيف دبلجة الأنمي والمواسم</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
                <Text style={styles.resetBtnText}>إعادة تعيين</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn} accessibilityLabel="إغلاق النافذة">
                <Icon name="close" size={18} color={THEME.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Scrollable Filter Content */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 1. Audio / Dubbing Section */}
            <AudioFilterSection
              activeFilterAudio={activeFilterAudio}
              onChangeFilterAudio={onChangeFilterAudio}
            />

            {/* 2. Genres & Themes Section */}
            <GenreFilterSection
              localGenres={localGenres}
              onToggleGenre={toggleGenre}
            />

            {/* 3. Anime Work Status */}
            <StatusFilterSection
              activeFilterStatus={activeFilterStatus}
              onChangeFilterStatus={onChangeFilterStatus}
            />

            {/* 4. Video Quality & Resolution */}
            <QualityFilterSection
              localQuality={localQuality}
              onQualitySelect={handleQualitySelect}
            />

            {/* 5. Era Quick Chips & Timeline */}
            <EraFilterSection
              localEra={localEra}
              onEraSelect={handleEraSelect}
            />

            {/* 6. Sort Order */}
            <SortFilterSection
              localSort={localSort}
              onSortSelect={handleSortSelect}
            />
          </ScrollView>

          {/* Sticky Bottom Modal Action Bar */}
          <View style={styles.bottomActionBar}>
            <View style={styles.counterBadge}>
              <Text style={styles.counterBadgeLabel}>نشط الآن</Text>
              <Text style={styles.counterBadgeValue}>{activeCount}</Text>
            </View>
            <TouchableOpacity
              style={styles.applyFilterBtn}
              onPress={onClose}
              activeOpacity={0.85}
            >
              <Icon name="auto_awesome" size={20} color={THEME.colors.onPrimaryContainer} />
              <Text style={styles.applyFilterText}>
                تطبيق الفلاتر (عرض {totalFilteredCount} نتيجة)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
