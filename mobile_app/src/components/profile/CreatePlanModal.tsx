import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './profile.styles';
import { createPlan } from '../../services/api';
import { Plan } from '../../types';

interface CreatePlanModalProps {
  visible: boolean;
  onClose: () => void;
  onPlanCreated: (newPlan: Plan) => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  visible,
  onClose,
  onPlanCreated,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('30');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState(
    'مشاهدة بدقة 1080p FHD بدون إعلانات\nسيرفرات فائقة السرعة للأعضاء\nتحميل الحلقات للمشاهدة بدون إنترنت'
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال اسم الخطة');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      Alert.alert('تنبيه', 'يرجى إدخال سعر صالح للخطة');
      return;
    }

    setLoading(true);
    try {
      const features = featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const res = await createPlan({
        name: name.trim(),
        price: numPrice,
        duration: duration.trim() || '30',
        description: description.trim(),
        features,
        isActive: true,
      });

      if (res.plan) {
        Alert.alert('نجاح', `تم إنشاء الخطة "${res.plan.name}" بنجاح!`);
        setName('');
        setPrice('');
        setDescription('');
        onPlanCreated(res.plan);
        onClose();
      } else {
        Alert.alert('خطأ', res.error || 'فشل إنشاء الخطة');
      }
    } catch (err: any) {
      Alert.alert('خطأ', err.message || 'تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, { maxHeight: '90%' }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="close" size={20} color={THEME.colors.onSurfaceVariant} />
              </TouchableOpacity>
              <Text style={styles.modalHeading}>إنشاء خطة اشتراك جديدة</Text>
            </View>

            <Text style={{ ...THEME.typography.bodySm, color: THEME.colors.onSurfaceVariant, textAlign: 'right' }}>
              قم بإدخال بيانات الخطة الجديدة ليتم إنشاؤها عبر API وتفعيلها مباشرة.
            </Text>

            {/* Plan Name */}
            <View style={styles.modalInputGroup}>
              <Text style={styles.formLabel}>اسم الخطة *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="مثال: باقة الأوتاكو الأسطورية"
                placeholderTextColor="rgba(223, 226, 238, 0.4)"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Price & Duration Row */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={[styles.modalInputGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>السعر ($) *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="مثال: 4.99"
                  placeholderTextColor="rgba(223, 226, 238, 0.4)"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>

              <View style={[styles.modalInputGroup, { flex: 1 }]}>
                <Text style={styles.formLabel}>المدة (بالأيام)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="مثال: 30 أو 365"
                  placeholderTextColor="rgba(223, 226, 238, 0.4)"
                  keyboardType="numeric"
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>
            </View>

            {/* Description */}
            <View style={styles.modalInputGroup}>
              <Text style={styles.formLabel}>وصف الخطة</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="وصف مختصر لمميزات الخطة"
                placeholderTextColor="rgba(223, 226, 238, 0.4)"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            {/* Features list */}
            <View style={styles.modalInputGroup}>
              <Text style={styles.formLabel}>المميزات (ميزة في كل سطر)</Text>
              <TextInput
                style={styles.textAreaInput}
                placeholder={'ميزة 1\nميزة 2\nميزة 3'}
                placeholderTextColor="rgba(223, 226, 238, 0.4)"
                multiline
                numberOfLines={4}
                value={featuresText}
                onChangeText={setFeaturesText}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.modalSubmitBtn, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={THEME.colors.onPrimaryContainer} />
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Icon name="sparkles" size={20} color={THEME.colors.onPrimaryContainer} />
                  <Text style={styles.modalSubmitText}>إنشاء الخطة عبر API</Text>
                </View>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
