import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Episode } from '../types';
import { THEME } from '../constants/theme';
import { Icon } from '../components/Icon';

export interface DownloadedEpisodeItem {
  id: string;
  title: string;
  series: string;
  seriesId: string;
  episodeNumber: number;
  thumbnail: string;
  sizeMB: number;
  quality: string;
  qualityTag: 'FHD' | 'HD' | 'SD';
  downloadedAt: string;
  watchedPercentage: number; // 0 for not started, 45, 100 for completed
  timestamp: number;
}

export interface DownloadsScreenProps {
  onPlayEpisode: (episode: Episode) => void;
  onBack?: () => void;
}

const INITIAL_DOWNLOADS: DownloadedEpisodeItem[] = [
  // Group 1: Slam Dunk
  {
    id: 'slam-ep-47',
    title: 'الحلقة 47: العزيمة النارية',
    series: 'سلام دانك (Slam Dunk)',
    seriesId: 'slam-dunk',
    episodeNumber: 47,
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuARaixDwClMBk8VjPmR1Q2rUIzdPzwaLu2UN88LAaneAT68-Dt1lyWDu-0gkKtii62D2siPahcfHX4SFVz3C3ign3Ab0TRwZXQSb7CIPBeuWZDXQrKYufhHb07FXgObV8byTeeQEjhmD0JGOHPuJ6crdhM7akhITM1MepDnWa_wDBnvnNco4IYOGt659sF1WSCFyKDMcDNWPrC9fEF1R_xhCvvamv9DhG2ws40iHFKDLtDpbhs8NwJP',
    sizeMB: 340,
    quality: '1080p',
    qualityTag: 'FHD',
    downloadedAt: 'أمس',
    watchedPercentage: 100,
    timestamp: Date.now() - 86400000,
  },
  {
    id: 'slam-ep-48',
    title: 'الحلقة 48: الصراع تحت السلة',
    series: 'سلام دانك (Slam Dunk)',
    seriesId: 'slam-dunk',
    episodeNumber: 48,
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFCBkEUZo8xV4WIupmc5uNpKqdnyHvRtXxO9kMzYTpVkAux1wiez5BMTP4wHyZzuwwVZOg_wpgku3f7SnzUPb-4AGdqIsO36pWFPLcHgbVL64MitADw-y54oNHCZX-4R68Oz9JjSkUHPj2bxQcK1UB22KBS5LnDGWFtCTle9at7MijbCu1PebjShS7NLnq718Qqm3TY2AhyBuHK0i-Pu5wO9kEtxsnSQlwrIRAINlXkAbGKHpT3o3v',
    sizeMB: 335,
    quality: '1080p',
    qualityTag: 'FHD',
    downloadedAt: 'منذ يومين',
    watchedPercentage: 45,
    timestamp: Date.now() - 172800000,
  },
  {
    id: 'slam-ep-49',
    title: 'الحلقة 49: الرمية الحاسمة',
    series: 'سلام دانك (Slam Dunk)',
    seriesId: 'slam-dunk',
    episodeNumber: 49,
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmq2nceLUBxfoOJqYBIc68pDPpefSLxVY7M152CuX1IFOvAxGj2Rpzxp5F0gSr9Y-BCCe6usdJzndy7g6LaB-KJ-OxcCkIZlzk3STd-PC5P66C7xc8q6jnEjHoVG329FisGcXuAgmQrr3_GIOV33yYYRqCVtaAfyqBqZo5cPhodjoVnHmyLZe0S9_WXU_A9aFSXfY6j_doWh4QTJJsde1fCHFuQxJN7NBNo5kvNQnkZOAusJIra160',
    sizeMB: 220,
    quality: '720p',
    qualityTag: 'HD',
    downloadedAt: 'منذ 4 أيام',
    watchedPercentage: 0,
    timestamp: Date.now() - 345600000,
  },
  // Group 2: Detective Conan
  {
    id: 'conan-ep-1120',
    title: 'الحلقة 1120: أسرار المنظمة السوداء',
    series: 'المحقق كونان (Detective Conan)',
    seriesId: 'conan',
    episodeNumber: 1120,
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWgp8np84cU1pXiGfgFONwPbOudYl8mTLiLB82xpMXlPaKPJE-OGVma0ZRcVdaBQPZvdKb_6Uo2gyoTSfUHPOxkO6gdZMGsXK-EIu7ynMnfDwHUw0-CFJgdyTvg3-nMZf1dGTZh20_O9O7fw-nPNJpQbD3NwHGgwyl67y3yKr2OhcKeQtL5lruF0W1xxWpgohfZJn9Y5p5l-xGTpA47CxeaPX4_OaPUHtC4d43WCUOgEVLS3eCu1QT',
    sizeMB: 295,
    quality: '1080p',
    qualityTag: 'FHD',
    downloadedAt: 'منذ 3 أيام',
    watchedPercentage: 0,
    timestamp: Date.now() - 259200000,
  },
  {
    id: 'conan-ep-1121',
    title: 'الحلقة 1121: خطة جين وفودكا',
    series: 'المحقق كونان (Detective Conan)',
    seriesId: 'conan',
    episodeNumber: 1121,
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBkzQwotwlFWKwYMGEDBKpnA8r6Vyk3UuVFIwUBnjh2owad1EJvijv403ATBgE20KHg_w3-hz3rrHcSxUyjhJ9wGS2QUMdJT-Iry8_tAocWKC4b5N-DK-sTcivyCupsi23R0MWxWhw1o8AwIHBU9tWpOT8M443eD6bRn_1lDa2COXFsTWn2BYtqi8wgs-yG38Nek-r31DTq8rvEdRMIerm5Vq0xQPc2zrLjA9HBiYrdd0h3ymV6ln5Q',
    sizeMB: 195,
    quality: '720p',
    qualityTag: 'HD',
    downloadedAt: 'منذ 5 أيام',
    watchedPercentage: 100,
    timestamp: Date.now() - 432000000,
  },
  // Group 3: Hunter x Hunter 1999
  {
    id: 'hxh-ep-62',
    title: 'الحلقة 62: نهاية جزيرة الطمع',
    series: 'القناص (Hunter x Hunter 1999)',
    seriesId: 'hunter-x-hunter',
    episodeNumber: 62,
    thumbnail:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCcbCgbaCJ9Sjdse8Sovo5oYwivK5IwbP3-fNT2SFPG2lkLO0zm8Lg-BPLh15TVyG6OvfXxWmusccsHAVs2ZooJfdBy3n7dX7zQO70Baxlc3k2MM_37ytExM4q9jMncv-DA_lvpb9sOa8hcvBxE7_yuFx_nwPRI2-iADoyaJbkHI5MppnFDy_HF6OG6C5_NCZqpCI9J2zznZAp9g8llwP2Mxd046yXnBEK24Orhl65gcQ9Shn2EQ3Rk',
    sizeMB: 290,
    quality: '1080p',
    qualityTag: 'FHD',
    downloadedAt: 'منذ أسبوع',
    watchedPercentage: 80,
    timestamp: Date.now() - 604800000,
  },
];

type SortMode = 'size' | 'recent' | 'anime';

export const DownloadsScreen: React.FC<DownloadsScreenProps> = ({
  onPlayEpisode,
  onBack,
}) => {
  const [downloads, setDownloads] = useState<DownloadedEpisodeItem[]>(INITIAL_DOWNLOADS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortMode, setSortMode] = useState<SortMode>('size');
  const [cacheCleaned, setCacheCleaned] = useState(false);
  const [cleaningCache, setCleaningCache] = useState(false);

  // Settings states
  const [autoDeleteWatched, setAutoDeleteWatched] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [downloadQuality, setDownloadQuality] = useState<'FHD' | 'HD' | 'SAVER'>('FHD');

  // Multi-select toggle
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  const totalAppUsedMB = useMemo(() => {
    return downloads.reduce((acc, curr) => acc + curr.sizeMB, 0);
  }, [downloads]);

  // Series Grouping
  const seriesGroups = useMemo(() => {
    const map = new Map<
      string,
      {
        series: string;
        seriesId: string;
        year: string;
        icon: 'sports_basketball' | 'search_insights' | 'swords' | 'video_library';
        episodes: DownloadedEpisodeItem[];
      }
    >();

    downloads.forEach((item) => {
      if (!map.has(item.seriesId)) {
        let icon: 'sports_basketball' | 'search_insights' | 'swords' | 'video_library' = 'video_library';
        let year = '2000';
        if (item.seriesId === 'slam-dunk') {
          icon = 'sports_basketball';
          year = '1993';
        } else if (item.seriesId === 'conan') {
          icon = 'search_insights';
          year = '1996';
        } else if (item.seriesId === 'hunter-x-hunter') {
          icon = 'swords';
          year = '1999';
        }
        map.set(item.seriesId, {
          series: item.series,
          seriesId: item.seriesId,
          year,
          icon,
          episodes: [],
        });
      }
      map.get(item.seriesId)!.episodes.push(item);
    });

    // Apply sorting to episodes inside each group
    const groups = Array.from(map.values());
    groups.forEach((g) => {
      if (sortMode === 'size') {
        g.episodes.sort((a, b) => b.sizeMB - a.sizeMB);
      } else if (sortMode === 'recent') {
        g.episodes.sort((a, b) => b.timestamp - a.timestamp);
      } else {
        g.episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
      }
    });

    return groups;
  }, [downloads, sortMode]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === downloads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(downloads.map((d) => d.id)));
    }
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert('حذف الحلقة', 'هل ترغب في حذف هذه الحلقة لتحرير مساحة الذاكرة؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: () => {
          setDownloads((prev) => prev.filter((item) => item.id !== id));
          setSelectedIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        },
      },
    ]);
  };

  const handleDeleteSeries = (seriesId: string, seriesName: string) => {
    Alert.alert('حذف السلسلة', `هل تريد حذف كافة حلقات ${seriesName} المحملة؟`, [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف الكل',
        style: 'destructive',
        onPress: () => {
          setDownloads((prev) => prev.filter((item) => item.seriesId !== seriesId));
        },
      },
    ]);
  };

  const handleDeleteSelected = () => {
    const count = selectedIds.size;
    if (count === 0) return;
    Alert.alert('حذف المحدد', `هل ترغب في حذف ${count} حلقات محددة؟`, [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف المحدد',
        style: 'destructive',
        onPress: () => {
          setDownloads((prev) => prev.filter((item) => !selectedIds.has(item.id)));
          setSelectedIds(new Set());
        },
      },
    ]);
  };

  const handleCleanCache = () => {
    setCleaningCache(true);
    setTimeout(() => {
      setCleaningCache(false);
      setCacheCleaned(true);
      Alert.alert('تم التنظيف', 'تم تحرير 340 MB من الذاكرة المؤقتة بنجاح!');
    }, 800);
  };

  const totalSelectedMB = useMemo(() => {
    return downloads
      .filter((d) => selectedIds.has(d.id))
      .reduce((acc, curr) => acc + curr.sizeMB, 0);
  }, [downloads, selectedIds]);

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

        {/* STORAGE BREAKDOWN BANNER (Elevated Luminous Dark Surface) */}
        <View style={styles.storageCard}>
          {/* Ambient Glows */}
          <View style={styles.storageAmbientRed} />
          <View style={styles.storageAmbientAmber} />

          <View style={styles.storageCardInner}>
            {/* Storage Summary Header */}
            <View style={styles.storageHeaderRow}>
              <View style={styles.storageHeaderInfo}>
                <View style={styles.memoryIconWrap}>
                  <Icon name="memory" size={22} color={THEME.colors.primaryContainer} />
                </View>
                <View style={styles.storageMeta}>
                  <Text style={styles.storageTotalLabel}>مساحة الهاتف الكلية (128 GB)</Text>
                  <View style={styles.storageUsedRow}>
                    <Text style={styles.storageUsedValue}>
                      {(totalAppUsedMB / 1024).toFixed(2)} GB
                    </Text>
                    <Text style={styles.storageUsedCount}>
                      تنزيلات التطبيق ({downloads.length} حلقة)
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.freePercentBadge}>
                <Text style={styles.freePercentText}>60% متبقي</Text>
              </View>
            </View>

            {/* Segmented Storage Meter Bar */}
            <View style={styles.meterContainer}>
              <View style={styles.meterTrack}>
                {/* Anime Daze Downloads (Crimson Glow) */}
                <View
                  style={[
                    styles.meterSegment,
                    styles.meterSegmentPrimary,
                    { width: `${Math.max(2.5, (totalAppUsedMB / 128000) * 100)}%` },
                  ]}
                />
                {/* Other Apps & System (Muted Indigo/Variant) */}
                <View style={[styles.meterSegment, styles.meterSegmentVariant, { width: '37.8%' }]} />
                {/* Free Space (Soft Void) */}
                <View style={[styles.meterSegment, styles.meterSegmentVoid, { width: '60%' }]} />
              </View>

              {/* Legend Items */}
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: THEME.colors.primaryContainer }]} />
                  <Text style={styles.legendLabel}>
                    أنمي ديز ({(totalAppUsedMB / 1024).toFixed(1)} GB)
                  </Text>
                </View>

                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: THEME.colors.surfaceVariant }]} />
                  <Text style={styles.legendLabelMuted}>أخرى (48.2 GB)</Text>
                </View>

                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: THEME.colors.surfaceContainerHigh }]} />
                  <Text style={styles.legendLabelMuted}>فارغ (77.0 GB)</Text>
                </View>
              </View>
            </View>

            {/* Quick Cache Clean Bar */}
            <View style={styles.cleanCacheRow}>
              <View style={styles.cleanCacheInfo}>
                <Icon name="cleaning_services" size={18} color={THEME.colors.secondaryContainer} />
                <Text style={styles.cleanCacheText}>
                  {cacheCleaned
                    ? 'تم تنظيف الملفات المؤقتة'
                    : 'ملفات مؤقتة وكاش متراكم (340 MB)'}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.cleanCacheBtn,
                  cacheCleaned && styles.cleanCacheBtnDone,
                ]}
                onPress={handleCleanCache}
                disabled={cacheCleaned || cleaningCache}
                activeOpacity={0.8}
              >
                <Icon
                  name={cacheCleaned ? 'check' : 'auto_delete'}
                  size={14}
                  color={cacheCleaned ? THEME.colors.secondary : THEME.colors.primaryContainer}
                />
                <Text style={styles.cleanCacheBtnText}>
                  {cleaningCache
                    ? 'جارٍ التحرير...'
                    : cacheCleaned
                    ? 'تم التحرير'
                    : 'تنظيف سريع'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

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
                  {group.episodes.map((ep) => {
                    const isSelected = selectedIds.has(ep.id);

                    return (
                      <TouchableOpacity
                        key={ep.id}
                        style={[
                          styles.episodeRow,
                          isSelected && styles.episodeRowSelected,
                        ]}
                        onPress={() => {
                          if (isMultiSelectMode || selectedIds.size > 0) {
                            toggleSelect(ep.id);
                          } else {
                            const episodeObj: Episode = {
                              id: ep.id,
                              title: ep.title,
                              episode_number: ep.episodeNumber,
                              thumbnail: ep.thumbnail,
                              animeId: ep.seriesId,
                              animeTitle: ep.series,
                            };
                            onPlayEpisode(episodeObj);
                          }
                        }}
                        activeOpacity={0.85}
                      >
                        {/* Checkbox */}
                        {(isMultiSelectMode || selectedIds.size > 0) && (
                          <TouchableOpacity
                            style={[
                              styles.checkboxBtn,
                              isSelected && styles.checkboxBtnSelected,
                            ]}
                            onPress={() => toggleSelect(ep.id)}
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
                            source={{ uri: ep.thumbnail }}
                            style={styles.thumbImage}
                            resizeMode="cover"
                          />
                          <View style={styles.thumbVignette} />
                          <View style={styles.epNumberTag}>
                            <Text style={styles.epNumberText}>ح {ep.episodeNumber}</Text>
                          </View>
                          <View
                            style={[
                              styles.qualityTag,
                              ep.qualityTag === 'HD' && styles.qualityTagHD,
                            ]}
                          >
                            <Text style={styles.qualityTagText}>{ep.qualityTag}</Text>
                          </View>
                        </View>

                        {/* Episode Info */}
                        <View style={styles.episodeInfo}>
                          <Text style={styles.episodeTitle} numberOfLines={1}>
                            {ep.title}
                          </Text>

                          <View style={styles.episodeMetaRow}>
                            <Text style={styles.episodeMetaText}>{ep.quality}</Text>
                            <Text style={styles.episodeMetaDot}>•</Text>
                            <Text style={styles.episodeSizeText}>{ep.sizeMB} MB</Text>
                            <Text style={styles.episodeMetaDot}>•</Text>
                            <Text style={styles.episodeMetaText}>{ep.downloadedAt}</Text>
                          </View>

                          {/* Watch Status or Progress */}
                          {ep.watchedPercentage === 100 ? (
                            <View style={styles.watchedStatusRow}>
                              <Icon
                                name="check_circle"
                                size={13}
                                color={THEME.colors.secondary}
                                filled
                              />
                              <Text style={styles.watchedStatusText}>تمت المشاهدة (100%)</Text>
                            </View>
                          ) : ep.watchedPercentage > 0 ? (
                            <View style={styles.progressContainer}>
                              <View
                                style={[
                                  styles.progressBarFill,
                                  { width: `${ep.watchedPercentage}%` },
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
                          onPress={() => handleDeleteItem(ep.id)}
                          activeOpacity={0.7}
                          accessibilityLabel="حذف الحلقة"
                        >
                          <Icon name="delete" size={18} color={THEME.colors.onSurfaceVariant} />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    );
                  })}
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

            {/* Setting 4: Max Storage Quota */}
            <View style={styles.settingItem}>
              <View style={styles.settingLabels}>
                <Text style={styles.settingLabelMain}>الحد الأقصى للتنزيلات</Text>
                <Text style={styles.settingLabelDesc}>
                  إيقاف التنزيل عند الوصول للسعة المحددة
                </Text>
              </View>
              <View style={styles.quotaBadge}>
                <Text style={styles.quotaBadgeText}>5.0 GB</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
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

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* SUB-HEADER */
  subHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.margin,
    paddingTop: THEME.spacing.spaceSm,
    paddingBottom: THEME.spacing.spaceMd,
  },
  subHeaderRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: THEME.spacing.spaceSm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeaderTitles: {
    alignItems: 'flex-end',
  },
  subHeaderTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  subHeaderSubtitle: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
    marginTop: 2,
  },
  toggleSelectModeBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  toggleSelectModeBtnActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    borderWidth: 1,
    borderColor: THEME.colors.primaryContainer,
  },
  toggleSelectModeText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
  },
  toggleSelectModeTextActive: {
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },

  /* STORAGE CARD */
  storageCard: {
    marginHorizontal: THEME.spacing.margin,
    marginBottom: THEME.spacing.spaceLg,
    borderRadius: THEME.radius.xl,
    backgroundColor: THEME.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 6,
  },
  storageAmbientRed: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
  },
  storageAmbientAmber: {
    position: 'absolute',
    bottom: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(238, 152, 0, 0.1)',
  },
  storageCardInner: {
    padding: THEME.spacing.spaceMd,
    gap: THEME.spacing.spaceMd,
  },
  storageHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storageHeaderInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  memoryIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storageMeta: {
    alignItems: 'flex-end',
  },
  storageTotalLabel: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  storageUsedRow: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  storageUsedValue: {
    ...THEME.typography.headlineMd,
    fontWeight: '800',
    color: THEME.colors.onSurface,
  },
  storageUsedCount: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
  },
  freePercentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.DEFAULT,
    backgroundColor: THEME.colors.surfaceContainerHighest,
  },
  freePercentText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },

  /* METER TRACK */
  meterContainer: {
    gap: 6,
  },
  meterTrack: {
    flexDirection: 'row-reverse',
    height: 12,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceContainerLowest,
    overflow: 'hidden',
    padding: 2,
  },
  meterSegment: {
    height: '100%',
  },
  meterSegmentPrimary: {
    backgroundColor: THEME.colors.primaryContainer,
    borderRadius: THEME.radius.full,
  },
  meterSegmentVariant: {
    backgroundColor: THEME.colors.surfaceVariant,
  },
  meterSegmentVoid: {
    backgroundColor: 'rgba(38, 42, 51, 0.5)',
  },
  legendRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  legendItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
  },
  legendLabelMuted: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },

  /* CLEAN CACHE */
  cleanCacheRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: THEME.spacing.spaceXs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  cleanCacheInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  cleanCacheText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
  },
  cleanCacheBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceBright,
  },
  cleanCacheBtnDone: {
    backgroundColor: 'rgba(238, 152, 0, 0.15)',
  },
  cleanCacheBtnText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
  },

  /* BATCH & SORT BAR */
  batchAndSortBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.margin,
    marginBottom: THEME.spacing.spaceMd,
  },
  batchSelectArea: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  selectAllTrigger: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  selectAllText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurfaceVariant,
  },
  batchDividerDot: {
    color: 'rgba(223, 226, 238, 0.4)',
    fontSize: 12,
  },
  selectedCounterText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
  },
  sortPillsContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: THEME.colors.surfaceContainerLow,
    padding: 3,
    borderRadius: THEME.radius.xl,
    gap: 2,
  },
  sortPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.lg,
  },
  sortPillActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  sortPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  sortPillTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },

  /* SERIES GROUP */
  seriesGroupCard: {
    marginHorizontal: THEME.spacing.margin,
    marginBottom: THEME.spacing.spaceLg,
    gap: THEME.spacing.spaceSm,
  },
  seriesHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.colors.surfaceContainerLow,
    paddingHorizontal: THEME.spacing.spaceMd,
    paddingVertical: THEME.spacing.spaceSm,
    borderRadius: THEME.radius.xl,
  },
  seriesHeaderRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  seriesIconBox: {
    width: 34,
    height: 34,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seriesTitles: {
    alignItems: 'flex-end',
  },
  seriesNameRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  seriesNameText: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  seriesYearBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: THEME.radius.DEFAULT,
    backgroundColor: THEME.colors.surfaceVariant,
  },
  seriesYearText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurface,
  },
  seriesMetaText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  deleteSeriesBtn: {
    padding: 6,
  },

  /* EPISODES LIST */
  episodesList: {
    gap: 8,
  },
  episodeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 10,
    borderRadius: THEME.radius.xl,
    gap: 10,
  },
  episodeRowSelected: {
    backgroundColor: THEME.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: THEME.colors.primaryContainer,
  },
  checkboxBtn: {
    padding: 4,
  },
  checkboxBtnSelected: {},
  thumbContainer: {
    width: 110,
    height: 64,
    borderRadius: THEME.radius.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: THEME.colors.surfaceContainerLowest,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: 'rgba(10, 14, 22, 0.6)',
  },
  epNumberTag: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: 'rgba(10, 14, 22, 0.85)',
  },
  epNumberText: {
    ...THEME.typography.labelSm,
    fontSize: 9,
    color: THEME.colors.onSurface,
  },
  qualityTag: {
    position: 'absolute',
    top: 4,
    left: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: THEME.colors.primaryContainer,
  },
  qualityTagHD: {
    backgroundColor: THEME.colors.surfaceVariant,
  },
  qualityTagText: {
    ...THEME.typography.labelSm,
    fontSize: 9,
    fontWeight: '700',
    color: THEME.colors.onPrimaryContainer,
  },
  episodeInfo: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 3,
  },
  episodeTitle: {
    ...THEME.typography.bodyMd,
    fontWeight: '600',
    color: THEME.colors.onSurface,
    textAlign: 'right',
  },
  episodeMetaRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  episodeMetaText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  episodeMetaDot: {
    color: 'rgba(223, 226, 238, 0.4)',
    fontSize: 10,
  },
  episodeSizeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  watchedStatusRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  watchedStatusText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
  },
  progressContainer: {
    width: 100,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.surfaceVariant,
    overflow: 'hidden',
    marginTop: 3,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.primaryContainer,
    borderRadius: 2,
  },
  notStartedText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  deleteSingleBtn: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* EMPTY CONTAINER */
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    marginHorizontal: THEME.spacing.margin,
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.xl,
    gap: 12,
  },
  emptyTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  emptyDesc: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
  },

  /* SETTINGS SECTION */
  settingsSection: {
    marginHorizontal: THEME.spacing.margin,
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.spaceMd,
    gap: THEME.spacing.spaceMd,
  },
  settingsHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  settingsIconWrap: {
    width: 36,
    height: 36,
    borderRadius: THEME.radius.lg,
    backgroundColor: 'rgba(238, 152, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsTitles: {
    alignItems: 'flex-end',
  },
  settingsTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  settingsSubtitle: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingLabels: {
    flex: 1,
    alignItems: 'flex-end',
    paddingLeft: 12,
  },
  settingLabelMain: {
    ...THEME.typography.bodyMd,
    fontWeight: '600',
    color: THEME.colors.onSurface,
  },
  settingLabelDesc: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
    textAlign: 'right',
  },
  qualitySegmentGroup: {
    flexDirection: 'row-reverse',
    backgroundColor: THEME.colors.surfaceContainerHigh,
    padding: 3,
    borderRadius: THEME.radius.lg,
    gap: 2,
  },
  qualitySegmentBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.radius.DEFAULT,
  },
  qualitySegmentBtnActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  qualitySegmentText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  qualitySegmentTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  quotaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  quotaBadgeText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },

  /* FLOATING BULK ACTION BAR */
  floatingActionBar: {
    position: 'absolute',
    bottom: 20,
    left: THEME.spacing.margin,
    right: THEME.spacing.margin,
    zIndex: 50,
  },
  floatingBarInner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(38, 42, 51, 0.96)',
    paddingHorizontal: THEME.spacing.spaceMd,
    paddingVertical: THEME.spacing.spaceSm,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  floatingBarLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: THEME.colors.primaryContainer,
  },
  floatingBarTexts: {
    alignItems: 'flex-end',
  },
  floatingCountText: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  floatingSizeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  floatingBarActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  floatingCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
  },
  floatingCancelText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
  },
  floatingDeleteBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.primaryContainer,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  floatingDeleteText: {
    ...THEME.typography.labelMd,
    fontWeight: '700',
    color: THEME.colors.onPrimaryContainer,
  },
});
