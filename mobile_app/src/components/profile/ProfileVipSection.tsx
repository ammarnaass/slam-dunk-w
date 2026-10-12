import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './profile.styles';

interface ProfileVipSectionProps {
  selectedPlan: 'yearly' | 'monthly';
  onSelectPlan: (plan: 'yearly' | 'monthly') => void;
  onManagePlan?: () => void;
}

export const ProfileVipSection: React.FC<ProfileVipSectionProps> = ({
  selectedPlan,
  onSelectPlan,
  onManagePlan,
}) => {
  const handleManage = () => {
    if (onManagePlan) {
      onManagePlan();
    } else {
      Alert.alert('إدارة اشتراك VIP', 'خطة الاشتراك الحالية مفعلة حتى 15 أبريل 2025.');
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.vipSectionCard}>
        <View style={styles.vipSectionHeader}>
          <View style={styles.vipHeaderTitleRow}>
            <View style={styles.vipIconCircle}>
              <Icon name="stars" size={24} color={THEME.colors.secondary} filled />
            </View>
            <View>
              <Text style={styles.vipHeaderTitle}>باقات ANIME DAZE VIP</Text>
              <Text style={styles.vipHeaderSub}>عالم الأوتاكو الأسطوري بلا قيود</Text>
            </View>
          </View>

          <View style={styles.vipActiveBadge}>
            <Text style={styles.vipActiveBadgeText}>نشط حالياً</Text>
          </View>
        </View>

        {/* Perks Grid */}
        <View style={styles.perksGrid}>
          <View style={styles.perkItem}>
            <Icon name="star" size={16} color={THEME.colors.primaryContainer} filled />
            <Text style={styles.perkText}>مشاهدة بدقة 1080p FHD بدون إعلانات</Text>
          </View>
          <View style={styles.perkItem}>
            <Icon name="bolt" size={16} color={THEME.colors.secondary} filled />
            <Text style={styles.perkText}>سيرفرات فائقة السرعة مخصصة للأعضاء</Text>
          </View>
          <View style={styles.perkItem}>
            <Icon name="workspace_premium" size={16} color={THEME.colors.secondary} />
            <Text style={styles.perkText}>شارة تميز VIP متوهجة في قسم النقاشات</Text>
          </View>
          <View style={styles.perkItem}>
            <Icon name="download_for_offline" size={16} color={THEME.colors.primaryContainer} />
            <Text style={styles.perkText}>أولوية تنزيل الحلقات للمشاهدة بدون إنترنت</Text>
          </View>
        </View>

        {/* Plans Comparison */}
        <View style={styles.plansRow}>
          {/* Yearly Plan */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'yearly' && styles.planCardActive,
            ]}
            onPress={() => onSelectPlan('yearly')}
            activeOpacity={0.85}
          >
            <View style={styles.saveTag}>
              <Text style={styles.saveTagText}>الأكثر توفيراً</Text>
            </View>
            <Text style={styles.planName}>الاشتراك السنوي</Text>
            <Text style={styles.planPriceGold}>
              29.99$ <Text style={styles.planPricePeriod}>/ سنة</Text>
            </Text>
            <Text style={styles.planSaveText}>وفر 37% مقارنة بالشهري</Text>
          </TouchableOpacity>

          {/* Monthly Plan */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.planCardActive,
            ]}
            onPress={() => onSelectPlan('monthly')}
            activeOpacity={0.85}
          >
            <Text style={styles.planName}>الاشتراك الشهري</Text>
            <Text style={styles.planPriceWhite}>
              3.99$ <Text style={styles.planPricePeriod}>/ شهر</Text>
            </Text>
            <Text style={styles.planSaveText}>إلغاء التجديد في أي وقت</Text>
          </TouchableOpacity>
        </View>

        {/* Manage Plan Button */}
        <TouchableOpacity
          style={styles.managePlanBtn}
          onPress={handleManage}
          activeOpacity={0.9}
        >
          <Icon name="cached" size={18} color={THEME.colors.onSecondary} />
          <Text style={styles.managePlanBtnText}>
            إدارة اشتراك VIP الحالي وتعديل الخطة
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
