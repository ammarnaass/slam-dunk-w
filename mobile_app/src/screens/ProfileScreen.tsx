import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Share,
  Modal,
} from 'react-native';
import { THEME } from '../constants/theme';
import {
  API_BASE_URL,
  setApiBaseUrl,
  loginUser,
  setAuthToken,
  getAuthToken,
  fetchUserProfile,
} from '../services/api';
import { UserProfile } from '../types';
import { Icon, IconName } from '../components/Icon';

interface ProfileScreenProps {
  onServerUrlChange?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onServerUrlChange,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [activeTab, setActiveTab] = useState<'fav' | 'history'>('fav');

  // Form states
  const [displayName, setDisplayName] = useState('عمار الناصري');
  const [handle, setHandle] = useState('Otaku_King99');
  const [gender, setGender] = useState<'male' | 'female' | 'unspecified'>('male');

  // Settings states
  const [streamQuality, setStreamQuality] = useState('1080p');
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
      const data = await fetchUserProfile();
      if (data) {
        setProfile(data);
        setIsLoggedIn(true);
        if (data.name) setDisplayName(data.name);
      }
    } catch (_) {}
  }, []);

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
      <View style={styles.profileHeroSection}>
        <View style={styles.glowBlob1} />
        <View style={styles.glowBlob2} />

        <View style={styles.profileHeroCard}>
          {/* Avatar with Ring & Badges */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGradientRing}>
              <Image
                source={{
                  uri:
                    profile?.avatar ||
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCCZjmzlo6X0pIwIou5pcHvqx3nA-ilqfqhpaodDPEAVOEJjOXXV5afRjE_9TQLXLgj1YHbHeYSpCVWw_SkX1jK88zV5nhGfXIMty0lDE1BVxyPDYbaGYxUny6PF-UvELXyVLoUVF2HoTOJ0trxX5EI6wJs9fqShJ81HeS968bjlZnmb6eW30nJN9C9lJ3yPVVVx5Y5BDDRTWHJ87-4LUrsDbR2eG1tzV0CqKDcHomt7MLQX-49pR6k',
                }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>

            {/* VIP Crown Tag */}
            <View style={styles.vipCrownTag}>
              <Icon name="workspace_premium" size={13} color={THEME.colors.onSecondary} />
              <Text style={styles.vipCrownText}>VIP S2</Text>
            </View>

            {/* Camera Edit Button */}
            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={() =>
                Alert.alert('تغيير الصورة', 'اختر صورة من معرض هاتفك لتحديث مظهرك الرمزي')
              }
              accessibilityLabel="تغيير الصورة الرمزية"
            >
              <Icon name="photo_camera" size={16} color={THEME.colors.white} />
            </TouchableOpacity>
          </View>

          {/* Names and Status */}
          <View style={styles.nameSection}>
            <View style={styles.nameRow}>
              <Text style={styles.displayNameText}>{displayName}</Text>
              <View style={styles.handleBadge}>
                <Text style={styles.handleText}>@{handle}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Icon name="calendar_month" size={14} color={THEME.colors.primary} />
                <Text style={styles.metaText}>عضو منذ مارس 2022</Text>
              </View>
              <Text style={styles.metaDot}>•</Text>
              <View style={styles.metaItem}>
                <Icon name="stars" size={14} color={THEME.colors.secondary} />
                <Text style={styles.metaTextGold}>مشترك VIP سنوي ✨</Text>
              </View>
            </View>
          </View>

          {/* Quick Stats Bento Banner */}
          <View style={styles.statsBanner}>
            <View style={styles.statBox}>
              <Text style={styles.statNumberPrimary}>482</Text>
              <Text style={styles.statLabel}>حلقة مكتملة</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumberSecondary}>36</Text>
              <Text style={styles.statLabel}>أنمي مفضل</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumberWhite}>1,420</Text>
              <Text style={styles.statLabel}>ساعة مشاهدة</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. VIP Subscription & Perks Showcase */}
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
              onPress={() => setSelectedPlan('yearly')}
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
              onPress={() => setSelectedPlan('monthly')}
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
            onPress={() =>
              Alert.alert('إدارة اشتراك VIP', 'خطة الاشتراك الحالية مفعلة حتى 15 أبريل 2025.')
            }
            activeOpacity={0.9}
          >
            <Icon name="cached" size={18} color={THEME.colors.onSecondary} />
            <Text style={styles.managePlanBtnText}>
              إدارة اشتراك VIP الحالي وتعديل الخطة
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Favorites & Watch History Tabs */}
      <View style={styles.section}>
        <View style={styles.tabsSwitcher}>
          <TouchableOpacity
            style={[
              styles.tabSwitchBtn,
              activeTab === 'fav' && styles.tabSwitchBtnActive,
            ]}
            onPress={() => setActiveTab('fav')}
            activeOpacity={0.8}
          >
            <Icon
              name="favorite"
              size={16}
              color={
                activeTab === 'fav'
                  ? THEME.colors.onPrimaryContainer
                  : THEME.colors.onSurfaceVariant
              }
            />
            <Text
              style={[
                styles.tabSwitchText,
                activeTab === 'fav' && styles.tabSwitchTextActive,
              ]}
            >
              المفضلة وقائمتي (3)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabSwitchBtn,
              activeTab === 'history' && styles.tabSwitchBtnActive,
            ]}
            onPress={() => setActiveTab('history')}
            activeOpacity={0.8}
          >
            <Icon
              name="history"
              size={16}
              color={
                activeTab === 'history'
                  ? THEME.colors.onPrimaryContainer
                  : THEME.colors.onSurfaceVariant
              }
            />
            <Text
              style={[
                styles.tabSwitchText,
                activeTab === 'history' && styles.tabSwitchTextActive,
              ]}
            >
              سجل المشاهدة الكامل
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Favorites List */}
        {activeTab === 'fav' ? (
          <View style={styles.listContainer}>
            {/* Slam Dunk Item */}
            <View style={styles.favListItem}>
              <Image
                source={{
                  uri:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuDA4APdvNc-tlKnz6ku8e-cE8SSb9hdIWdw5sdz1nxBduEM_CFr9lAVvAt2cx2ATpg106M436tm4ImjBa2SE3dL1yTl8q5i_5HvMjeB3P5XdrydqO7_oAjTHSHzYYBn7J-DcytGywJdz0rnjpIim_grriAQmM8mtrTAPJgDjgGdWvl2EzFmpcHENDW-No74ze5Du9WxCX0390bVM1zQpxbhRDDnsEwVIvU9JMIKuUX6A2ZID_1ZlLMR',
                }}
                style={styles.favThumb}
                resizeMode="cover"
              />
              <View style={styles.favMeta}>
                <View style={styles.favTitleRow}>
                  <Text style={styles.favTitle}>سلام دانك (Slam Dunk)</Text>
                  <View style={styles.favRating}>
                    <Icon name="star" size={13} color={THEME.colors.secondary} filled />
                    <Text style={styles.favRatingText}>9.4</Text>
                  </View>
                </View>
                <Text style={styles.favSub}>رياضي • 101 حلقة • مكتمل</Text>
              </View>
            </View>

            {/* Conan Item */}
            <View style={styles.favListItem}>
              <Image
                source={{
                  uri:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBFZePy18zXlyvf-zAvSXGoKcybY45ItTYs8cbq0s47cObB1bfayCp7Rz610PV-B983leQAfWvmC5lCu5F8LZ8ZIVwj6Ojl3osKyhYbmGjrkDI67cTa5sLZHYQrBgGmPTbgfuw5vTahhIlvuYOTMgXRTQLEED6ce8P4SBEW4R_DI0glnTn7ujMRunxpaeEsq5xgLcVFk2lZ5XRGNDZXp6dBocZa1vkgbDrRGBsHQophqvIL0foe7cHn',
                }}
                style={styles.favThumb}
                resizeMode="cover"
              />
              <View style={styles.favMeta}>
                <View style={styles.favTitleRow}>
                  <Text style={styles.favTitle}>المحقق كونان</Text>
                  <View style={styles.favRating}>
                    <Icon name="star" size={13} color={THEME.colors.secondary} filled />
                    <Text style={styles.favRatingText}>8.9</Text>
                  </View>
                </View>
                <Text style={styles.favSub}>غموض • +1100 حلقة • مستمر</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.listContainer}>
            <View style={styles.favListItem}>
              <View style={styles.historyTimeIcon}>
                <Icon name="play_arrow" size={20} color={THEME.colors.primaryContainer} filled />
              </View>
              <View style={styles.favMeta}>
                <Text style={styles.favTitle}>سلام دانك - الحلقة 47</Text>
                <Text style={styles.favSub}>شوهد 65% • قبل يومين</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* 4. Personal Info Form */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderTitleRow}>
          <View style={styles.titleDot} />
          <Text style={styles.sectionHeading}>البيانات الشخصية والمعلومات العامة</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>اسم العرض في التطبيق</Text>
            <View style={styles.inputWrap}>
              <Icon name="person" size={18} color={THEME.colors.onSurfaceVariant} />
              <TextInput
                style={styles.textInput}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>معرّف الحساب الفريد (ID Handle)</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.inputPrefix}>@</Text>
              <TextInput
                style={styles.textInput}
                value={handle}
                onChangeText={setHandle}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Gender Selector */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>الجنس (Gender)</Text>
            <View style={styles.genderRow}>
              {[
                { key: 'male', label: 'ذكر' },
                { key: 'female', label: 'أنثى' },
                { key: 'unspecified', label: 'لا أود التحديد' },
              ].map((g) => (
                <TouchableOpacity
                  key={g.key}
                  style={[
                    styles.genderPill,
                    gender === g.key && styles.genderPillActive,
                  ]}
                  onPress={() => setGender(g.key as any)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.genderText,
                      gender === g.key && styles.genderTextActive,
                    ]}
                  >
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* 5. App Settings & Playback Preferences */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderTitleRow}>
          <View style={styles.titleDotAmber} />
          <Text style={styles.sectionHeading}>إعدادات التطبيق وبث الفيديو</Text>
        </View>

        <View style={styles.formCard}>
          {/* Stream Quality */}
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>جودة البث الافتراضية</Text>
              <Text style={styles.settingDesc}>1080p FHD (أعلى جودة لسيرفرات VIP)</Text>
            </View>
            <View style={styles.qualityPill}>
              <Text style={styles.qualityPillText}>{streamQuality}</Text>
            </View>
          </View>

          <View style={styles.formDivider} />

          {/* Auto Next */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setAutoPlayNext(!autoPlayNext)}
            activeOpacity={0.8}
          >
            <View>
              <Text style={styles.settingTitle}>تشغيل الحلقة التالية تلقائياً</Text>
              <Text style={styles.settingDesc}>الانتقال الفوري دون مقاطعة الحماس</Text>
            </View>
            <View
              style={[
                styles.switchTrack,
                autoPlayNext && styles.switchTrackActive,
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  autoPlayNext && styles.switchThumbActive,
                ]}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.formDivider} />

          {/* Notifications */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            activeOpacity={0.8}
          >
            <View>
              <Text style={styles.settingTitle}>تنبيهات الحلقات الجديدة</Text>
              <Text style={styles.settingDesc}>إشعار فوري عند صدور حلقة أو فيلم</Text>
            </View>
            <View
              style={[
                styles.switchTrack,
                notificationsEnabled && styles.switchTrackActive,
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  notificationsEnabled && styles.switchThumbActive,
                ]}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.formDivider} />

          {/* Custom API Base URL for Mobile Dev */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>عنوان خادم البث وAPI (للمطورين)</Text>
            <View style={styles.apiInputRow}>
              <TextInput
                style={[styles.textInput, styles.apiInput]}
                value={customApiUrl}
                onChangeText={setCustomApiUrl}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.apiSaveBtn}
                onPress={handleSaveApiUrl}
                activeOpacity={0.8}
              >
                <Text style={styles.apiSaveBtnText}>حفظ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* 6. Account Actions & Logout */}
      <View style={styles.section}>
        <View style={styles.accountActionsRow}>
          {isLoggedIn ? (
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Icon name="trash" size={18} color={THEME.colors.error} />
              <Text style={styles.logoutText}>تسجيل الخروج من الحساب</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => setShowLoginModal(true)}
              activeOpacity={0.8}
            >
              <Icon name="person" size={18} color={THEME.colors.white} />
              <Text style={styles.loginText}>تسجيل الدخول / إنشاء حساب</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.shareProfileBtn}
            onPress={handleShareProfile}
            activeOpacity={0.8}
          >
            <Icon name="share" size={18} color={THEME.colors.onSurface} />
            <Text style={styles.shareProfileText}>مشاركة الحساب</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionFooter}>
          ANIME DAZE Mobile • الإصدار 1.0.0 (Crimson Cinema RTL)
        </Text>
      </View>

      {/* Login Modal */}
      <Modal
        visible={showLoginModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>تسجيل الدخول إلى ANIME DAZE</Text>
              <TouchableOpacity onPress={() => setShowLoginModal(false)}>
                <Icon name="close" size={20} color={THEME.colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.formLabel}>البريد الإلكتروني</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="name@animedaze.com"
                placeholderTextColor="rgba(223, 226, 238, 0.4)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.formLabel}>كلمة المرور</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="••••••••••••"
                placeholderTextColor="rgba(223, 226, 238, 0.4)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleLogin}
              activeOpacity={0.9}
            >
              <Text style={styles.modalSubmitText}>دخول ومزامنة الحساب</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  profileHeroSection: {
    position: 'relative',
    overflow: 'hidden',
    padding: THEME.spacing.margin,
  },
  glowBlob1: {
    position: 'absolute',
    top: -24,
    right: 40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
  },
  glowBlob2: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(238, 152, 0, 0.12)',
  },
  profileHeroCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.xl,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 6,
    gap: 14,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGradientRing: {
    width: 104,
    height: 104,
    borderRadius: 52,
    padding: 3,
    backgroundColor: THEME.colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  vipCrownTag: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: THEME.colors.secondaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
    shadowColor: THEME.colors.secondaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  vipCrownText: {
    color: THEME.colors.onSecondary,
    fontSize: 10,
    fontWeight: '900',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  nameSection: {
    alignItems: 'center',
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  displayNameText: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  handleBadge: {
    backgroundColor: THEME.colors.surfaceContainerHighest,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.full,
  },
  handleText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
  },
  metaTextGold: {
    ...THEME.typography.bodySm,
    color: THEME.colors.secondary,
  },
  metaDot: {
    color: THEME.colors.onSurfaceVariant,
  },
  statsBanner: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderRadius: THEME.radius.md,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumberPrimary: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.primaryContainer,
    fontWeight: '800',
  },
  statNumberSecondary: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.secondary,
    fontWeight: '800',
  },
  statNumberWhite: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
    fontWeight: '800',
  },
  statLabel: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: THEME.spacing.margin,
    marginTop: 20,
    gap: 12,
  },
  vipSectionCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.xl,
    padding: 16,
    gap: 14,
    shadowColor: THEME.colors.secondaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4,
  },
  vipSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vipHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  vipIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(238, 152, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipHeaderTitle: {
    ...THEME.typography.headlineSm,
    fontSize: 16,
    color: THEME.colors.onSurface,
  },
  vipHeaderSub: {
    ...THEME.typography.bodySm,
    color: THEME.colors.secondary,
  },
  vipActiveBadge: {
    backgroundColor: THEME.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
  },
  vipActiveBadgeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSecondary,
    fontWeight: '800',
  },
  perksGrid: {
    gap: 8,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(10, 14, 22, 0.6)',
    padding: 10,
    borderRadius: 8,
  },
  perkText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurface,
  },
  plansRow: {
    flexDirection: 'row',
    gap: 10,
  },
  planCard: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceContainerLowest,
    padding: 12,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 4,
    position: 'relative',
  },
  planCardActive: {
    borderColor: THEME.colors.secondary,
    backgroundColor: THEME.colors.surfaceContainerLow,
  },
  saveTag: {
    position: 'absolute',
    top: -8,
    left: 8,
    backgroundColor: THEME.colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: THEME.radius.full,
  },
  saveTagText: {
    color: THEME.colors.onSecondary,
    fontSize: 8,
    fontWeight: '900',
  },
  planName: {
    ...THEME.typography.titleMd,
    fontSize: 14,
    color: THEME.colors.onSurface,
  },
  planPriceGold: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.secondary,
    fontWeight: '800',
  },
  planPriceWhite: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
    fontWeight: '800',
  },
  planPricePeriod: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    fontWeight: 'normal',
  },
  planSaveText: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  managePlanBtn: {
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.secondaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: THEME.colors.secondaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  managePlanBtnText: {
    ...THEME.typography.labelLg,
    color: THEME.colors.onSecondary,
    fontWeight: '800',
  },
  tabsSwitcher: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.surfaceContainerLow,
    padding: 3,
    borderRadius: THEME.radius.md,
  },
  tabSwitchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabSwitchBtnActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  tabSwitchText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurfaceVariant,
  },
  tabSwitchTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  listContainer: {
    gap: 10,
  },
  favListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: THEME.colors.surfaceContainer,
    padding: 10,
    borderRadius: THEME.radius.md,
  },
  favThumb: {
    width: 60,
    height: 80,
    borderRadius: 6,
    backgroundColor: THEME.colors.surfaceContainerLowest,
  },
  favMeta: {
    flex: 1,
    gap: 4,
  },
  favTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  favRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  favRatingText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  favSub: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
  },
  historyTimeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.primaryContainer,
  },
  titleDotAmber: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.secondary,
  },
  sectionHeading: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  formCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.lg,
    padding: 16,
    gap: 14,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
    textAlign: 'right',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  textInput: {
    flex: 1,
    color: THEME.colors.onSurface,
    ...THEME.typography.bodyMd,
    textAlign: 'right',
  },
  inputPrefix: {
    color: THEME.colors.onSurfaceVariant,
    fontSize: 16,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderPill: {
    flex: 1,
    height: 42,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderPillActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  genderText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurfaceVariant,
  },
  genderTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTitle: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
  },
  settingDesc: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 2,
  },
  qualityPill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qualityPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primaryContainer,
    fontWeight: '800',
  },
  formDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    padding: 2,
    justifyContent: 'center',
  },
  switchTrackActive: {
    backgroundColor: THEME.colors.primaryContainer,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.colors.onSurfaceVariant,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: THEME.colors.white,
  },
  apiInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  apiInput: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    height: 44,
  },
  apiSaveBtn: {
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apiSaveBtnText: {
    color: THEME.colors.white,
    fontWeight: '700',
  },
  accountActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  logoutBtn: {
    flex: 1,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: 'rgba(214, 49, 53, 0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.error,
    fontWeight: '700',
  },
  loginBtn: {
    flex: 1,
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primaryContainer,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loginText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.white,
    fontWeight: '700',
  },
  shareProfileBtn: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  shareProfileText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onSurface,
  },
  versionFooter: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.xl,
    padding: 20,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalHeading: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  modalInputGroup: {
    gap: 6,
  },
  modalInput: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    height: 46,
    color: THEME.colors.onSurface,
    textAlign: 'right',
  },
  modalSubmitBtn: {
    height: 48,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  modalSubmitText: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
});
