import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '../Icon';
import { styles } from './downloads.styles';

interface DownloadsFloatingBarProps {
  selectedCount: number;
  totalSelectedMB: number;
  onCancel: () => void;
  onDeleteSelected: () => void;
}

export const DownloadsFloatingBar: React.FC<DownloadsFloatingBarProps> = ({
  selectedCount,
  totalSelectedMB,
  onCancel,
  onDeleteSelected,
}) => {
  if (selectedCount === 0) return null;

  return (
    <View style={styles.floatingActionBar}>
      <View style={styles.floatingBarInner}>
        <View style={styles.floatingBarLeft}>
          <View style={styles.pulseDot} />
          <View style={styles.floatingBarTexts}>
            <Text style={styles.floatingCountText}>
              {selectedCount} حلقات محددة
            </Text>
            <Text style={styles.floatingSizeText}>
              إجمالي الحجم: {totalSelectedMB} MB
            </Text>
          </View>
        </View>

        <View style={styles.floatingBarActions}>
          <TouchableOpacity
            style={styles.floatingCancelBtn}
            onPress={onCancel}
            activeOpacity={0.8}
          >
            <Text style={styles.floatingCancelText}>إلغاء</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.floatingDeleteBtn}
            onPress={onDeleteSelected}
            activeOpacity={0.85}
          >
            <Icon name="delete_forever" size={18} color="#FFFFFF" />
            <Text style={styles.floatingDeleteText}>حذف المحدد</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
