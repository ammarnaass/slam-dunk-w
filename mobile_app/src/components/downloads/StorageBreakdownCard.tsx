import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './downloads.styles';

interface StorageBreakdownCardProps {
  totalAppUsedMB: number;
  totalDownloadsCount: number;
  cacheCleaned: boolean;
  cleaningCache: boolean;
  onCleanCache: () => void;
}

export const StorageBreakdownCard: React.FC<StorageBreakdownCardProps> = ({
  totalAppUsedMB,
  totalDownloadsCount,
  cacheCleaned,
  cleaningCache,
  onCleanCache,
}) => {
  return (
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
                  تنزيلات التطبيق ({totalDownloadsCount} حلقة)
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
            onPress={onCleanCache}
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
  );
};
