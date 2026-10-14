import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import {
  API_BASE_URL,
  setApiBaseUrl,
  loginUser,
  setAuthToken,
  fetchUserProfile,
  fetchPlans,
} from '../services/api';
import { UserProfile, Plan } from '../types';
import { styles } from '../components/profile/profile.styles';
import { ProfileHeroHeader } from '../components/profile/ProfileHeroHeader';
import { ProfileVipSection } from '../components/profile/ProfileVipSection';
import { ProfileActivityTabs } from '../components/profile/ProfileActivityTabs';
import { ProfilePersonalInfoForm } from '../components/profile/ProfilePersonalInfoForm';
import { ProfileSettingsForm } from '../components/profile/ProfileSettingsForm';
import { ProfileAccountActions } from '../components/profile/ProfileAccountActions';
import { ProfileLoginModal } from '../components/profile/ProfileLoginModal';
import { CreatePlanModal } from '../components/profile/CreatePlanModal';

interface ProfileScreenProps {
  onServerUrlChange?: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  onOpenVip?: () => void;
  onOpenSettings?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onServerUrlChange,
  onOpenLogin,
  onOpenRegister,
  onOpenVip,
  onOpenSettings,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'fav' | 'history'>('fav');

  // Form states
  const [displayName, setDisplayName] = useState('عمار الناصري');
  const [handle, setHandle] = useState('Otaku_King99');
  const [gender, setGender] = useState<'male' | 'female' | 'unspecified'>('male');

  // Settings states
  const [streamQuality] = useState('1080p');
  const [autoPlayNext, setAutoPlayNext] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [customApiUrl, setCustomApiUrl] = useState(API_BASE_URL);

  // Auth states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const [data, fetchedPlans] = await Promise.all([
        fetchUserProfile().catch(() => null),
        fetchPlans().catch(() => []),
      ]);
      if (data) {
        setProfile(data);
        setIsLoggedIn(true);
        if (data.name) setDisplayName(data.name);
      }
      if (fetchedPlans && fetchedPlans.length > 0) {
        setPlans(fetchedPlans);
        const popular = fetchedPlans.find((p) => p.isPopular);
        if (popular) {
          setSelectedPlan(popular.id);
        } else if (fetchedPlans[0]) {
          setSelectedPlan(fetchedPlans[0].id);
        }
      }
    } catch (_) {}
  }, []);

  const handlePlanCreated = (newPlan: Plan) => {
    setPlans((prev) => [newPlan, ...prev]);
    setSelectedPlan(newPlan.id);
  };

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('تنبيه', 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    try {
      const res = await loginUser(email, password);
      if (res.user) {
        setProfile(res.user);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        loadProfile();
        Alert.alert('نجاح', 'تم تسجيل الدخول بنجاح ومزامنة حساب VIP!');
      } else {
        Alert.alert('خطأ', res.error || 'فشل تسجيل الدخول');
      }
    } catch (err: any) {
      Alert.alert('خطأ', err.message || 'تعذر الاتصال بالخادم');
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setIsLoggedIn(false);
    setProfile(null);
    Alert.alert('تم تسجيل الخروج', 'تم حفظ بياناتك المحلية بأمان.');
  };

  const handleSaveApiUrl = () => {
    if (!customApiUrl.trim()) return;
    setApiBaseUrl(customApiUrl.trim());
    onServerUrlChange?.();
    Alert.alert('تم التحديث', 'تم تعيين عنوان الخادم الجديد بنجاح');
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `ملف الأوتاكو الخاص بي على ANIME DAZE (@${handle})! https://slam-dunk-w.vercel.app`,
      });
    } catch (_) {}
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Profile Identity Header Card */}
      <ProfileHeroHeader
        profile={profile}
        displayName={displayName}
        handle={handle}
      />

      {/* 2. VIP Subscription & Perks Showcase */}
      <ProfileVipSection
        plans={plans}
        selectedPlan={selectedPlan}
        onSelectPlan={setSelectedPlan}
        onManagePlan={onOpenVip}
        onCreatePlanPress={() => setShowCreatePlanModal(true)}
      />

      {/* 3. Favorites & Watch History Tabs */}
      <ProfileActivityTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 4. Personal Info Form */}
      <ProfilePersonalInfoForm
        displayName={displayName}
        onDisplayNameChange={setDisplayName}
        handle={handle}
        onHandleChange={setHandle}
        gender={gender}
        onGenderChange={setGender}
      />

      {/* 5. App Settings & Playback Preferences */}
      <ProfileSettingsForm
        streamQuality={streamQuality}
        autoPlayNext={autoPlayNext}
        onToggleAutoPlayNext={() => setAutoPlayNext(!autoPlayNext)}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
        customApiUrl={customApiUrl}
        onCustomApiUrlChange={setCustomApiUrl}
        onSaveApiUrl={handleSaveApiUrl}
      />

      {/* 6. Account Actions & Logout */}
      <ProfileAccountActions
        isLoggedIn={isLoggedIn}
        onLogin={onOpenLogin || (() => setShowLoginModal(true))}
        onLogout={handleLogout}
        onShareProfile={handleShareProfile}
      />

      {/* Login Modal */}
      <ProfileLoginModal
        visible={showLoginModal}
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Create Plan Modal */}
      <CreatePlanModal
        visible={showCreatePlanModal}
        onClose={() => setShowCreatePlanModal(false)}
        onPlanCreated={handlePlanCreated}
      />
    </ScrollView>
  );
};
