import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './profile.styles';
import { Plan } from '../../types';

interface ProfileVipSectionProps {
  plans?: Plan[];
  selectedPlan: string;
  onSelectPlan: (planId: string) => void;
  onManagePlan?: () => void;
  onCreatePlanPress?: () => void;
}

export const ProfileVipSection: React.FC<ProfileVipSectionProps> = ({
  plans = [],
  selectedPlan,
  onSelectPlan,
  onManagePlan,
  onCreatePlanPress,
}) => {
  const handleManage = () => {
    if (onManagePlan) {
      onManagePlan();
    } else {
      Alert.alert('إدارة اشتراك VIP', 'خطة الاشتراك الحالية مفعلة حتى 15 أبريل 2025.');
    }
  };

  const displayPlans = plans.length > 0 ? plans : [
    {
      id: 'yearly',
      name: 'الاشتراك السنوي',
      price: 29.99,
      duration: '365',
      description: 'وفر 37% مقارنة بالشهري',
      features: [],
      isPopular: true,
    },
    {
      id: 'monthly',
      name: 'الاشتراك الشهري',
      price: 3.99,
      duration: '30',
      description: 'إلغاء التجديد في أي وقت',
      features: [],
      isPopular: false,
    },
  ];

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
          {displayPlans.slice(0, 2).map((plan) => {
            const isSelected = selectedPlan === plan.id || (selectedPlan === 'yearly' && plan.duration === '365');
            const isYearlyOrPopular = plan.isPopular || plan.duration === '365';

            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  isSelected && styles.planCardActive,
                ]}
                onPress={() => onSelectPlan(plan.id)}
                activeOpacity={0.85}
              >
                {isYearlyOrPopular && (
                  <View style={styles.saveTag}>
                    <Text style={styles.saveTagText}>الأكثر طلباً</Text>
                  </View>
                )}
                <Text style={styles.planName} numberOfLines={1}>{plan.name}</Text>
                <Text style={isYearlyOrPopular ? styles.planPriceGold : styles.planPriceWhite}>
                  {plan.price}$ <Text style={styles.planPricePeriod}>/ {plan.duration === '365' ? 'سنة' : `${plan.duration} يوم`}</Text>
                </Text>
                <Text style={styles.planSaveText} numberOfLines={1}>
                  {plan.description || (isYearlyOrPopular ? 'وفر 37% مقارنة بالشهري' : 'إلغاء التجديد في أي وقت')}
                </Text>
              </TouchableOpacity>
            );
          })}
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

        {/* Create Plan Button */}
        {onCreatePlanPress && (
          <TouchableOpacity
            style={styles.createPlanBtn}
            onPress={onCreatePlanPress}
            activeOpacity={0.85}
          >
            <Icon name="sparkles" size={18} color={THEME.colors.secondary} />
            <Text style={styles.createPlanBtnText}>
              إنشاء خطة اشتراك جديدة (API) +
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

