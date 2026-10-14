import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Episode } from '../types';
import { THEME } from '../constants/theme';
import { Icon } from '../components/Icon';
import { useDownloadManager } from '../hooks/useDownloadManager';
import { StorageBreakdownCard } from '../components/downloads/StorageBreakdownCard';
import { DownloadedEpisodeCard } from '../components/downloads/DownloadedEpisodeCard';
import { DownloadSettingsCard } from '../components/downloads/DownloadSettingsCard';
import { DownloadsFloatingBar } from '../components/downloads/DownloadsFloatingBar';
import { styles } from '../components/downloads/downloads.styles';

export interface DownloadsScreenProps {
  onPlayEpisode: (episode: Episode) => void;
  onBack?: () => void;
}

export const DownloadsScreen: React.FC<DownloadsScreenProps> = ({
  onPlayEpisode,
  onBack,
}) => {
  const {
    downloads,
    selectedIds,
    setSelectedIds,
    sortMode,
    setSortMode,
    cacheCleaned,
    cleaningCache,
    totalAppUsedMB,
    totalSelectedMB,
    seriesGroups,
    toggleSelect,
    handleSelectAll,
    handleDeleteItem,
    handleDeleteSeries,
    handleDeleteSelected,
    handleCleanCache,
  } = useDownloadManager();

  // Settings states
  const [autoDeleteWatched, setAutoDeleteWatched] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [downloadQuality, setDownloadQuality] = useState<'FHD' | 'HD' | 'SAVER'>('FHD');

  // Multi-select toggle
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  return (
    <View style={styles.rootContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* SUB-HEADER & ACTION BAR */}
        <View style={styles.subHeader}>
          <View style={styles.subHeaderRight}>
            {onBack && (
              <TouchableOpacity
                onPress={onBack}
                style={styles.backBtn}
                activeOpacity={0.8}
                accessibilityLabel="الرجوع"
              >
                <Icon name="arrow_forward" size={20} color={THEME.colors.onSurface} />
              </TouchableOpacity>
            )}
            <View style={styles.subHeaderTitles}>
              <Text style={styles.subHeaderTitle}>إدارة التنزيلات والذاكرة</Text>
              <Text style={styles.subHeaderSubtitle}>المساحة المتوفرة ووحدة التخزين</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.toggleSelectModeBtn,
              isMultiSelectMode && styles.toggleSelectModeBtnActive,
            ]}
            onPress={() => {
              setIsMultiSelectMode((prev) => !prev);
              if (isMultiSelectMode) {
                setSelectedIds(new Set());
              }
            }}
            activeOpacity={0.8}
          >
            <Icon
              name="checklist"
              size={16}
              color={isMultiSelectMode ? THEME.colors.primaryContainer : THEME.colors.onSurface}
            />
            <Text
              style={[
                styles.toggleSelectModeText,
                isMultiSelectMode && styles.toggleSelectModeTextActive,
              ]}
            >
              {isMultiSelectMode ? 'إلغاء التحديد' : 'تحديد متعدد'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* STORAGE BREAKDOWN BANNER */}
        <StorageBreakdownCard
          totalAppUsedMB={totalAppUsedMB}
          totalDownloadsCount={downloads.length}
          cacheCleaned={cacheCleaned}
          cleaningCache={cleaningCache}
          onCleanCache={handleCleanCache}
        />

        {/* SMART BATCH OPERATIONS BAR & SORTING PILLS */}
        <View style={styles.batchAndSortBar}>
          <View style={styles.batchSelectArea}>
            <TouchableOpacity
              style={styles.selectAllTrigger}
              onPress={handleSelectAll}
              activeOpacity={0.7}
            >
              <Icon
                name={
                  selectedIds.size === downloads.length && downloads.length > 0
                    ? 'check_box'
                    : 'check_box_outline_blank'
                }
                size={18}
                color={
                  selectedIds.size === downloads.length && downloads.length > 0
                    ? THEME.colors.primaryContainer
                    : THEME.colors.onSurfaceVariant
                }
              />
              <Text style={styles.selectAllText}>تحديد الكل</Text>
            </TouchableOpacity>
            <Text style={styles.batchDividerDot}>•</Text>
            <Text style={styles.selectedCounterText}>{selectedIds.size} محدد</Text>
          </View>

          {/* Quick Filter / Sort Pills */}
          <View style={styles.sortPillsContainer}>
            <TouchableOpacity
              style={[styles.sortPill, sortMode === 'size' && styles.sortPillActive]}
              onPress={() => setSortMode('size')}
              activeOpacity={0.7}
            >
              <Text style={[styles.sortPillText, sortMode === 'size' && styles.sortPillTextActive]}>
                الأكبر حجماً
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortPill, sortMode === 'recent' && styles.sortPillActive]}
              onPress={() => setSortMode('recent')}
              activeOpacity={0.7}
            >
              <Text style={[styles.sortPillText, sortMode === 'recent' && styles.sortPillTextActive]}>
                الأحدث
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortPill, sortMode === 'anime' && styles.sortPillActive]}
              onPress={() => setSortMode('anime')}
              activeOpacity={0.7}
            >
              <Text style={[styles.sortPillText, sortMode === 'anime' && styles.sortPillTextActive]}>
                الأنمي
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ANIME SERIES GROUPS */}
        {downloads.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="download_for_offline" size={48} color={THEME.colors.onSurfaceVariant} />
            <Text style={styles.emptyTitle}>لا توجد حلقات محملة حالياً</Text>
            <Text style={styles.emptyDesc}>
              قم بتحميل حلقاتك المفضلة للمشاهدة في أي وقت أوفلاين دون استهلاك باقة الإنترنت.
            </Text>
          </View>
        ) : (
          seriesGroups.map((group) => {
            const groupTotalMB = group.episodes.reduce((acc, curr) => acc + curr.sizeMB, 0);

            return (
              <View key={group.seriesId} style={styles.seriesGroupCard}>
                {/* Series Group Header */}
                <View style={styles.seriesHeader}>
                  <View style={styles.seriesHeaderRight}>
                    <View style={styles.seriesIconBox}>
                      <Icon
                        name={group.icon}
                        size={20}
                        color={THEME.colors.primaryContainer}
                      />
                    </View>
                    <View style={styles.seriesTitles}>
                      <View style={styles.seriesNameRow}>
                        <Text style={styles.seriesNameText}>{group.series}</Text>
                        <View style={styles.seriesYearBadge}>
                          <Text style={styles.seriesYearText}>{group.year}</Text>
                        </View>
                      </View>
                      <Text style={styles.seriesMetaText}>
                        {group.episodes.length} حلقات محملة • {groupTotalMB} MB
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteSeriesBtn}
                    onPress={() => handleDeleteSeries(group.seriesId, group.series)}
                    activeOpacity={0.7}
                    accessibilityLabel="حذف كل حلقات السلسلة"
                  >
                    <Icon name="delete_sweep" size={18} color={THEME.colors.onSurfaceVariant} />
                  </TouchableOpacity>
                </View>

                {/* Episode Items */}
                <View style={styles.episodesList}>
                  {group.episodes.map((ep) => (
                    <DownloadedEpisodeCard
                      key={ep.id}
                      item={ep}
                      isSelected={selectedIds.has(ep.id)}
                      isMultiSelectMode={isMultiSelectMode || selectedIds.size > 0}
                      onToggleSelect={toggleSelect}
                      onPlayEpisode={onPlayEpisode}
                      onDeleteItem={handleDeleteItem}
                    />
                  ))}
                </View>
              </View>
            );
          })
        )}

        {/* SMART DOWNLOAD SETTINGS & STORAGE AUTOMATION (Extracted Component) */}
        <DownloadSettingsCard
          autoDeleteWatched={autoDeleteWatched}
          onToggleAutoDelete={setAutoDeleteWatched}
          wifiOnly={wifiOnly}
          onToggleWifiOnly={setWifiOnly}
          downloadQuality={downloadQuality}
          onChangeQuality={setDownloadQuality}
        />
      </ScrollView>

      {/* FLOATING STICKY MULTI-DELETE ACTION BAR (Extracted Component) */}
      <DownloadsFloatingBar
        selectedCount={selectedIds.size}
        totalSelectedMB={totalSelectedMB}
        onCancel={() => setSelectedIds(new Set())}
        onDeleteSelected={handleDeleteSelected}
      />
    </View>
  );
};
