import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Episode } from '../types';
import { THEME } from '../constants/theme';
import { Icon } from '../components/Icon';
import { useDownloadManager } from '../hooks/useDownloadManager';
import { StorageBreakdownCard } from '../components/downloads/StorageBreakdownCard';
import { DownloadedEpisodeCard } from '../components/downloads/DownloadedEpisodeCard';
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

        {/* SMART DOWNLOAD SETTINGS & STORAGE AUTOMATION */}
        <View style={styles.settingsSection}>
          <View style={styles.settingsHeader}>
            <View style={styles.settingsIconWrap}>
              <Icon name="tune" size={20} color={THEME.colors.secondaryContainer} />
            </View>
            <View style={styles.settingsTitles}>
              <Text style={styles.settingsTitle}>إعدادات التنزيل والذاكرة الذكية</Text>
              <Text style={styles.settingsSubtitle}>تحكم آلي بالذاكرة دون تدخل يدوي</Text>
            </View>
          </View>

          <View style={styles.settingsList}>
            {/* Setting 1: Auto Delete */}
            <View style={styles.settingItem}>
              <View style={styles.settingLabels}>
                <Text style={styles.settingLabelMain}>حذف تلقائي بعد المشاهدة</Text>
                <Text style={styles.settingLabelDesc}>
                  إزالة الحلقة تلقائياً بعد 24 ساعة من إكمالها
                </Text>
              </View>
              <Switch
                value={autoDeleteWatched}
                onValueChange={setAutoDeleteWatched}
                trackColor={{
                  false: THEME.colors.surfaceVariant,
                  true: THEME.colors.primaryContainer,
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Setting 2: Wi-Fi Only */}
            <View style={styles.settingItem}>
              <View style={styles.settingLabels}>
                <Text style={styles.settingLabelMain}>التنزيل عبر Wi-Fi فقط</Text>
                <Text style={styles.settingLabelDesc}>
                  الحفاظ على باقة بيانات الهاتف من الاستهلاك
                </Text>
              </View>
              <Switch
                value={wifiOnly}
                onValueChange={setWifiOnly}
                trackColor={{
                  false: THEME.colors.surfaceVariant,
                  true: THEME.colors.primaryContainer,
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Setting 3: Default Download Quality */}
            <View style={styles.settingItem}>
              <View style={styles.settingLabels}>
                <Text style={styles.settingLabelMain}>جودة التنزيل الافتراضية</Text>
                <Text style={styles.settingLabelDesc}>تحديد جودة الفيديو المفضلة مسبقاً</Text>
              </View>
              <View style={styles.qualitySegmentGroup}>
                <TouchableOpacity
                  style={[
                    styles.qualitySegmentBtn,
                    downloadQuality === 'FHD' && styles.qualitySegmentBtnActive,
                  ]}
                  onPress={() => setDownloadQuality('FHD')}
                >
                  <Text
                    style={[
                      styles.qualitySegmentText,
                      downloadQuality === 'FHD' && styles.qualitySegmentTextActive,
                    ]}
                  >
                    FHD
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.qualitySegmentBtn,
                    downloadQuality === 'HD' && styles.qualitySegmentBtnActive,
                  ]}
                  onPress={() => setDownloadQuality('HD')}
                >
                  <Text
                    style={[
                      styles.qualitySegmentText,
                      downloadQuality === 'HD' && styles.qualitySegmentTextActive,
                    ]}
                  >
                    HD
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.qualitySegmentBtn,
                    downloadQuality === 'SAVER' && styles.qualitySegmentBtnActive,
                  ]}
                  onPress={() => setDownloadQuality('SAVER')}
                >
                  <Text
                    style={[
                      styles.qualitySegmentText,
                      downloadQuality === 'SAVER' && styles.qualitySegmentTextActive,
                    ]}
                  >
                    توفير
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FLOATING STICKY MULTI-DELETE ACTION BAR */}
      {selectedIds.size > 0 && (
        <View style={styles.floatingActionBar}>
          <View style={styles.floatingBarInner}>
            <View style={styles.floatingBarLeft}>
              <View style={styles.pulseDot} />
              <View style={styles.floatingBarTexts}>
                <Text style={styles.floatingCountText}>
                  {selectedIds.size} حلقات محددة
                </Text>
                <Text style={styles.floatingSizeText}>
                  إجمالي الحجم: {totalSelectedMB} MB
                </Text>
              </View>
            </View>

            <View style={styles.floatingBarActions}>
              <TouchableOpacity
                style={styles.floatingCancelBtn}
                onPress={() => setSelectedIds(new Set())}
                activeOpacity={0.8}
              >
                <Text style={styles.floatingCancelText}>إلغاء</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.floatingDeleteBtn}
                onPress={handleDeleteSelected}
                activeOpacity={0.85}
              >
                <Icon name="delete_forever" size={18} color="#FFFFFF" />
                <Text style={styles.floatingDeleteText}>حذف المحدد</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
