import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { Plan } from '../../types';
import { vipStyles as styles } from './vip.styles';

interface VipPerksCardProps {
  plans: Plan[];
  selectedPlanId: string;
  onSelectPlanId: (id: string) => void;
  loadingPlans: boolean;
  onSubscribe: () => void;
  onCreatePlanPress: () => void;
}

export const VipPerksCard: React.FC<VipPerksCardProps> = ({
  plans,
  selectedPlanId,
  onSelectPlanId,
  loadingPlans,
  onSubscribe,
  onCreatePlanPress,
}) => {
  return (
    <View style={styles.perksCard}>
      {/* Header */}
      <View style={styles.perksHeader}>
        <View style={styles.perksHeaderLeft}>
          <View style={styles.perksIconBox}>
            <Icon name="stars" size={22} color={THEME.colors.secondary} filled />
          </View>
          <View>
            <Text style={styles.perksTitle}>مزايا باقة الأوتاكو VIP</Text>
            <Text style={styles.perksSubtitle}>عالم الأوتاكو الأسطوري بلا قيود</Text>
          </View>
        </View>
        <View style={styles.activeTagBadge}>
          <Text style={styles.activeTagText}>نشط حالياً</Text>
        </View>
      </View>

      {/* 4 Feature Items */}
      <View style={styles.perksGrid}>
        <View style={styles.perkItem}>
          <Icon name="close" size={16} color={THEME.colors.primaryContainer} strokeWidth={3} />
          <Text style={styles.perkText}>مشاهدة بدقة 1080p FHD بدون أي إعلانات</Text>
        </View>
        <View style={styles.perkItem}>
          <Icon name="bolt" size={16} color={THEME.colors.secondary} filled />
          <Text style={styles.perkText}>سيرفرات فائقة السرعة مخصصة للأعضاء</Text>
        </View>
        <View style={styles.perkItem}>
          <Icon name="workspace_premium" size={16} color={THEME.colors.secondary} filled />
          <Text style={styles.perkText}>شارة تميز VIP متوهجة في قسم النقاشات</Text>
        </View>
        <View style={styles.perkItem}>
          <Icon name="download" size={16} color={THEME.colors.primaryContainer} />
          <Text style={styles.perkText}>أولوية تنزيل الحلقات للمشاهدة بدون إنترنت</Text>
        </View>
      </View>

      {/* Real Plans Selection from API */}
      {loadingPlans ? (
        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
          <ActivityIndicator size="small" color={THEME.colors.secondary} />
        </View>
      ) : plans.length > 0 ? (
        <View style={styles.tiersRow}>
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isPopular = plan.isPopular || plan.duration === '365' || plan.price >= 10;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.tierCard,
                  isSelected && styles.tierCardSelected,
                ]}
                onPress={() => onSelectPlanId(plan.id)}
                activeOpacity={0.8}
              >
                {isPopular && (
                  <View style={styles.bestValuePill}>
                    <Text style={styles.bestValueText}>الأكثر طلباً</Text>
                  </View>
                )}
                <Text style={styles.tierName} numberOfLines={1}>{plan.name}</Text>
                <Text style={[styles.tierPrice, isSelected && { color: THEME.colors.secondary }]}>
                  {plan.price}$ <Text style={styles.tierDuration}>/ {plan.duration === '365' ? 'سنة' : `${plan.duration} يوم`}</Text>
                </Text>
                {plan.description ? (
                  <Text style={styles.tierSaving} numberOfLines={1}>{plan.description}</Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View style={{ paddingVertical: 14, alignItems: 'center' }}>
          <Text style={{ color: THEME.colors.textMuted, fontSize: 12 }}>لا توجد باقات معروضة حالياً</Text>
        </View>
      )}

      {/* Action Button */}
      <TouchableOpacity
        style={styles.subscribeBtn}
        onPress={onSubscribe}
        activeOpacity={0.85}
      >
        <Icon name="cached" size={20} color="#472A00" strokeWidth={2.5} />
        <Text style={styles.subscribeBtnText}>تفعيل الخطة المختارة ومتابعة الاشتراك</Text>
      </TouchableOpacity>

      {/* Create Plan Button (API) */}
      <TouchableOpacity
        style={styles.createPlanBtn}
        onPress={onCreatePlanPress}
        activeOpacity={0.85}
      >
        <Icon name="auto_awesome" size={17} color={THEME.colors.secondary} />
        <Text style={styles.createPlanBtnText}>إنشاء خطة اشتراك جديدة عبر API +</Text>
      </TouchableOpacity>
    </View>
  );
};
