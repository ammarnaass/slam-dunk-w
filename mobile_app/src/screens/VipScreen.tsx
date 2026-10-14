import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { THEME } from '../constants/theme';
import { Icon } from '../components/Icon';
import { UserProfile, Plan } from '../types';
import { fetchPlans } from '../services/api';
import { CreatePlanModal } from '../components/profile/CreatePlanModal';
import { vipStyles as styles } from '../components/vip/vip.styles';
import { VipProfileCard } from '../components/vip/VipProfileCard';
import { VipPerksCard } from '../components/vip/VipPerksCard';
import { VipActivityTabs } from '../components/vip/VipActivityTabs';

interface VipScreenProps {
  initialPlans?: Plan[];
  user?: UserProfile | null;
  onBack?: () => void;
  onSelectPlan?: (planId: string) => void;
  onNavigateToAnime?: (animeId: string) => void;
}

export const VipScreen: React.FC<VipScreenProps> = ({
  initialPlans,
  user,
  onBack,
  onSelectPlan,
  onNavigateToAnime,
}) => {
  const [plans, setPlans] = useState<Plan[]>(initialPlans || []);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    initialPlans && initialPlans[0] ? initialPlans[0].id : ''
  );
  const [loadingPlans, setLoadingPlans] = useState(!initialPlans || initialPlans.length === 0);
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'fav' | 'history'>('fav');

  useEffect(() => {
    let mounted = true;
    if (initialPlans && initialPlans.length > 0) {
      setPlans(initialPlans);
      setLoadingPlans(false);
      return;
    }
    (async () => {
      try {
        const fetched = await fetchPlans();
        if (mounted && Array.isArray(fetched) && fetched.length > 0) {
          setPlans(fetched);
          const popular = fetched.find((p) => p.isPopular);
          setSelectedPlanId(popular ? popular.id : fetched[0].id);
        }
      } catch (e) {
        console.warn('Error loading plans in VipScreen:', e);
      } finally {
        if (mounted) setLoadingPlans(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [initialPlans]);

  const handleSubscribe = () => {
    const plan = plans.find((p) => p.id === selectedPlanId);
    const planName = plan?.name || 'VIP';
    const planPrice = plan?.price !== undefined ? `${plan.price}$` : '';
    Alert.alert(
      'تأكيد ترقية VIP 🌟',
      `تم اختيار "${planName}" ${planPrice ? `بقيمة ${planPrice}` : ''}. سيتم تفعيل المزايا المخصصة لحسابك.`,
      [{ text: 'متابعة', onPress: () => onSelectPlan?.(selectedPlanId) }]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow_forward" size={22} color={THEME.colors.onSurface} />
        </TouchableOpacity>

        <View style={styles.brandContainer}>
          <Text style={styles.headerTitle}>باقات ANIME DAZE VIP</Text>
        </View>

        <View style={styles.vipBadgePill}>
          <Icon name="star" size={12} color="#472A00" filled />
          <Text style={styles.vipBadgeText}>VIP</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. User Profile Header Card */}
        <VipProfileCard user={user} />

        {/* 3. VIP Perks & Plans Selection */}
        <VipPerksCard
          plans={plans}
          selectedPlanId={selectedPlanId}
          onSelectPlanId={setSelectedPlanId}
          loadingPlans={loadingPlans}
          onSubscribe={handleSubscribe}
          onCreatePlanPress={() => setShowCreatePlanModal(true)}
        />

        {/* 4. Lists & History Section */}
        <VipActivityTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onNavigateToAnime={onNavigateToAnime}
        />
      </ScrollView>

      {/* Create Plan Modal (API) */}
      <CreatePlanModal
        visible={showCreatePlanModal}
        onClose={() => setShowCreatePlanModal(false)}
        onPlanCreated={(newPlan) => {
          setPlans((prev) => [newPlan, ...prev]);
          setSelectedPlanId(newPlan.id);
        }}
      />
    </View>
  );
};
