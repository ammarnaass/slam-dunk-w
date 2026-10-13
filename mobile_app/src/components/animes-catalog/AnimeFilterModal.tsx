import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';

interface AnimeFilterModalProps {
  visible: boolean;
  onClose: () => void;
  activeFilterAudio: 'all' | 'dub' | 'sub';
  onChangeFilterAudio: (val: 'all' | 'dub' | 'sub') => void;
  activeFilterStatus: 'all' | 'completed' | 'ongoing';
  onChangeFilterStatus: (val: 'all' | 'completed' | 'ongoing') => void;
  totalFilteredCount: number;
}

export const AnimeFilterModal: React.FC<AnimeFilterModalProps> = ({
  visible,
  onClose,
  activeFilterAudio,
  onChangeFilterAudio,
  activeFilterStatus,
  onChangeFilterStatus,
  totalFilteredCount,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitleRow}>
              <Icon name="tune" size={20} color={THEME.colors.secondary} />
              <Text style={styles.modalTitle}>خيارات التصفية المتقدمة</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalCloseBtn}
            >
              <Icon name="close" size={20} color={THEME.colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            {/* Audio Filter */}
            <Text style={styles.filterGroupTitle}>المسار الصوتي</Text>
            <View style={styles.filterPillsRow}>
              {[
                { key: 'all', label: 'الكل' },
                { key: 'dub', label: 'دبلجة عربية (سبيستون)' },
                { key: 'sub', label: 'ياباني مترجم' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.modalPill,
                    activeFilterAudio === item.key && styles.modalPillActive,
                  ]}
                  onPress={() => onChangeFilterAudio(item.key as any)}
                >
                  <Text
                    style={[
                      styles.modalPillText,
                      activeFilterAudio === item.key && styles.modalPillTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Status Filter */}
            <Text style={styles.filterGroupTitle}>حالة العرض</Text>
            <View style={styles.filterPillsRow}>
              {[
                { key: 'all', label: 'الكل' },
                { key: 'completed', label: 'مكتمل' },
                { key: 'ongoing', label: 'مستمر' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.modalPill,
                    activeFilterStatus === item.key && styles.modalPillActive,
                  ]}
                  onPress={() => onChangeFilterStatus(item.key as any)}
                >
                  <Text
                    style={[
                      styles.modalPillText,
                      activeFilterStatus === item.key && styles.modalPillTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={styles.applyFilterBtn}
            onPress={onClose}
          >
            <Text style={styles.applyFilterText}>
              تطبيق التصفية • {totalFilteredCount} عمل متاح
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderTopLeftRadius: THEME.radius.xl,
    borderTopRightRadius: THEME.radius.xl,
    padding: 20,
    maxHeight: '80%',
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    gap: 14,
    paddingVertical: 8,
  },
  filterGroupTitle: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
    fontWeight: '700',
  },
  filterPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalPill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.radius.DEFAULT,
  },
  modalPillActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  modalPillText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurfaceVariant,
  },
  modalPillTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '800',
  },
  applyFilterBtn: {
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 5,
  },
  applyFilterText: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
});
