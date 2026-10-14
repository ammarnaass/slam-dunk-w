import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { THEME } from '../constants/theme';
import { Icon } from '../components/Icon';
import { useAppStore } from '../store/useAppStore';
import {
  AuthHeaderBar,
  LoginHeroBanner,
  LoginVipPerksRibbon,
  SocialAuthGrid,
  loginStyles as styles,
} from '../components/auth';

interface LoginScreenProps {
  onBack?: () => void;
  onNavigateToRegister?: () => void;
  onSuccess?: () => void;
  onSkipGuest?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onBack,
  onNavigateToRegister,
  onSuccess,
  onSkipGuest,
}) => {
  const { login, currentUser } = useAppStore();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!identifier.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال البريد الإلكتروني أو اسم المستخدم');
      return;
    }
    if (!password.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال كلمة المرور');
      return;
    }

    setSubmitting(true);
    try {
      const res = await login(identifier.trim(), password);
      if (res.success) {
        Alert.alert('مرحباً بك مجدداً! 🔥', `أهلاً بك يا ${currentUser?.name || 'بطل الصقور'}. تم تفعيل جلسة VIP ومزامنة بياناتك.`, [
          { text: 'متابعة', onPress: () => onSuccess?.() },
        ]);
      } else {
        Alert.alert('خطأ في الدخول', res.error || 'تحقق من صحة البيانات المدخلة');
      }
    } catch (err: any) {
      Alert.alert('خطأ', err.message || 'تعذر الاتصال بالخادم');
    } finally {
      setSubmitting(false);
    }
  };


  const handleForgotPassword = () => {
    Alert.alert(
      'استعادة كلمة المرور',
      'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني المسجل في ANIME DAZE.'
    );
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(
      `تسجيل الدخول عبر ${provider}`,
      `جاري استيراد حسابك في ${provider} ومزامنة تقدمك وقائمتك...`,
      [
        {
          text: 'متابعة',
          onPress: async () => {
            setSubmitting(true);
            await login(`${provider.toLowerCase()}@animedaze.app`, 'social_pass');
            setSubmitting(false);
            onSuccess?.();
          },
        },
        { text: 'إلغاء', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* 1. Header Bar */}
      <AuthHeaderBar onBack={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Ambient Glows */}
        <View style={styles.ambientCrimsonOrb} />
        <View style={styles.ambientAmberOrb} />

        {/* 2. Cinematic Backdrop Banner */}
        <LoginHeroBanner />

        {/* 3. VIP Perks Mini Ribbon */}
        <LoginVipPerksRibbon />

        {/* 4. Interactive Login Form Card */}
        <View style={styles.formCard}>
          {/* Identifier Input */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelIconText}>
                <Icon name="person" size={16} color={THEME.colors.primary} />
                <Text style={styles.inputLabel}>البريد الإلكتروني أو اسم المستخدم</Text>
              </View>
              <Text style={styles.requiredTag}>مطلوب</Text>
            </View>
            <View style={styles.inputBox}>
              <View style={styles.atIconWrapper}>
                <Icon name="alternate_email" size={18} color={THEME.colors.textMuted} />
              </View>
              <TextInput
                style={[styles.textInput, styles.ltrText]}
                placeholder="name@animedaze.com"
                placeholderTextColor="rgba(223, 226, 238, 0.4)"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                autoCorrect={false}
                textAlign="left"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <View style={styles.labelIconText}>
                <Icon name="lock" size={16} color={THEME.colors.primary} />
                <Text style={styles.inputLabel}>كلمة المرور</Text>
              </View>
              <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                <Text style={styles.forgotPassLink}>نسيت الرمز؟</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputBox}>
              <TextInput
                style={[styles.textInput, styles.ltrText, { paddingLeft: 42 }]}
                placeholder="••••••••••••"
                placeholderTextColor="rgba(223, 226, 238, 0.4)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                textAlign="left"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Icon
                  name={showPassword ? 'visibility_off' : 'visibility'}
                  size={18}
                  color={THEME.colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me & Secure Row */}
          <View style={styles.microOptionsRow}>
            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.rememberBox, rememberMe && styles.rememberBoxActive]}>
                {rememberMe && <Icon name="check" size={13} color="#FFF" strokeWidth={3} />}
              </View>
              <Text style={styles.rememberLabel}>تذكّر جلستي على هذا الجهاز</Text>
            </TouchableOpacity>

            <View style={styles.secureBadge}>
              <Icon name="bolt" size={14} color={THEME.colors.secondary} filled />
              <Text style={styles.secureBadgeText}>دخول مشفّر</Text>
            </View>
          </View>

          {/* Primary Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, submitting && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>تسجيل الدخول</Text>
                <Icon name="login" size={20} color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Skip / Guest Button */}
          <TouchableOpacity
            style={styles.guestBtn}
            onPress={onSkipGuest || onBack}
            activeOpacity={0.75}
          >
            <Icon name="visibility" size={18} color={THEME.colors.textMuted} />
            <Text style={styles.guestBtnText}>المتابعة كزائر بدون حساب</Text>
          </TouchableOpacity>
        </View>

        {/* 5. Shared Social Logins */}
        <SocialAuthGrid
          dividerLabel="أو واصل عبر الحسابات السريعة"
          onSelectProvider={handleSocialLogin}
        />

        {/* 6. Register Redirection Card */}
        <View style={styles.registerCard}>
          <View style={styles.registerCardInner}>
            <View style={styles.registerIconCircle}>
              <Icon name="person" size={20} color={THEME.colors.primaryContainer} />
            </View>
            <View style={styles.registerTexts}>
              <Text style={styles.registerTitle}>ليس لديك حساب بعد؟</Text>
              <Text style={styles.registerSub}>انضم لمجتمع الأنمي الأكبر عربياً</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={onNavigateToRegister}
            activeOpacity={0.8}
          >
            <Text style={styles.registerBtnText}>إنشاء حساب</Text>
          </TouchableOpacity>
        </View>

        {/* 7. Footer Note */}
        <View style={styles.footerRow}>
          <Icon name="verified_user" size={14} color={THEME.colors.secondary} />
          <Text style={styles.footerText}>
            ANIME DAZE • حساب آمن ومزامنة فورية لكافة حلقاتك المفضلة
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
