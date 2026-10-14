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
import { registerUser } from '../services/api';
import {
  AuthHeaderBar,
  RegisterHeroSection,
  PasswordStrengthMeter,
  GenrePreferenceSelector,
  SocialAuthGrid,
  registerStyles as styles,
} from '../components/auth';

interface RegisterScreenProps {
  onBack?: () => void;
  onNavigateToLogin?: () => void;
  onSuccess?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onBack,
  onNavigateToLogin,
  onSuccess,
}) => {
  // Form State
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePromo, setAgreePromo] = useState(true);

  // Preference pills
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['sports']);

  // Loading
  const [submitting, setSubmitting] = useState(false);

  // Password matching status
  const isMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const toggleGenre = (genreKey: string) => {
    if (selectedGenres.includes(genreKey)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genreKey));
    } else {
      setSelectedGenres([...selectedGenres, genreKey]);
    }
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال اسم المستخدم الفريد (Handle)');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('تنبيه', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    if (password.length < 6) {
      Alert.alert('تنبيه', 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('تنبيه', 'كلمتا المرور غير متطابقتين');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('تنبيه', 'يرجى الموافقة على شروط الخدمة وسياسة الخصوصية للمتابعة');
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerUser({
        name: displayName.trim() || username.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        genres: selectedGenres,
      });

      if (res.user) {
        Alert.alert(
          'أهلاً بك في ANIME DAZE! 🚀',
          'تم إنشاء حسابك بنجاح. استمتع بمشاهدة أسطورية ومزامنة فورية.',
          [{ text: 'ابدأ الاستكشاف', onPress: () => onSuccess?.() }]
        );
      } else {
        Alert.alert('خطأ', res.error || 'تعذر إتمام التسجيل');
      }
    } catch (err: any) {
      Alert.alert('خطأ', err.message || 'حدث خطأ في الاتصال');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    Alert.alert(
      `التسجيل عبر ${provider}`,
      `سيتم ربط حسابك في ${provider} ومزامنة تقدمك وقائمتك السحابية فوراً.`,
      [
        {
          text: 'متابعة',
          onPress: async () => {
            setSubmitting(true);
            const socialName = `${provider} Otaku`;
            await registerUser({
              name: socialName,
              username: `${provider.toLowerCase()}_user_${Math.floor(Math.random() * 1000)}`,
              email: `${provider.toLowerCase()}@animedaze.app`,
              password: 'social_secure_pass',
            });
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
        {/* Ambient Top Glow Blurs */}
        <View style={styles.ambientCrimsonBlob} />
        <View style={styles.ambientAmberBlob} />

        {/* 2. Headline & Feature Badges */}
        <RegisterHeroSection />

        {/* 3. Form Section */}
        <View style={styles.formContainer}>
          {/* Display Name */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>الاسم الكامل أو المستعار</Text>
              <Text style={styles.fieldHelper}>اختياري للعرض</Text>
            </View>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconRight}>
                <Icon name="badge" size={20} color={THEME.colors.textMuted} />
              </View>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="مثال: عمار الناصري"
                placeholderTextColor="rgba(223, 226, 238, 0.4)"
                value={displayName}
                onChangeText={setDisplayName}
                textAlign="right"
              />
            </View>
          </View>

          {/* Username / Handle */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>اسم المستخدم الفريد (Handle)</Text>
              <Text style={styles.requiredBadge}>* مطلوب</Text>
            </View>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconRight}>
                <Text style={styles.atSymbol}>@</Text>
              </View>
              <TextInput
                style={[styles.inputWithIcon, styles.ltrInput]}
                placeholder="otaku_hero"
                placeholderTextColor="rgba(223, 226, 238, 0.4)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                textAlign="left"
              />
            </View>
            <Text style={styles.inputBottomHint}>
              حروف إنجليزية، أرقام وشرطة سفلية فقط بدون مسافات.
            </Text>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>البريد الإلكتروني</Text>
              <Text style={styles.requiredBadge}>* مطلوب</Text>
            </View>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconRight}>
                <Icon name="mail" size={20} color={THEME.colors.textMuted} />
              </View>
              <TextInput
                style={[styles.inputWithIcon, styles.ltrInput]}
                placeholder="name@domain.com"
                placeholderTextColor="rgba(223, 226, 238, 0.4)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textAlign="left"
              />
            </View>
          </View>

          {/* Password with 4-bar Strength Indicator */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>كلمة المرور</Text>
              <Text style={styles.requiredBadge}>* مطلوب</Text>
            </View>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconRight}>
                <Icon name="lock" size={20} color={THEME.colors.textMuted} />
              </View>
              <TextInput
                style={[styles.inputWithIcon, styles.inputWithEye]}
                placeholder="••••••••••••"
                placeholderTextColor="rgba(223, 226, 238, 0.4)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                textAlign="right"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Icon
                  name={showPassword ? 'visibility_off' : 'visibility'}
                  size={20}
                  color={THEME.colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Modular Strength Meter */}
            <PasswordStrengthMeter password={password} />
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>تأكيد كلمة المرور</Text>
              {isMatch && (
                <Text style={styles.matchBadgeGreen}>✓ متطابقة</Text>
              )}
              {isMismatch && (
                <Text style={styles.matchBadgeRed}>✗ غير متطابقة</Text>
              )}
            </View>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconRight}>
                <Icon name="lock_reset" size={20} color={THEME.colors.textMuted} />
              </View>
              <TextInput
                style={[styles.inputWithIcon, styles.inputWithEye]}
                placeholder="••••••••••••"
                placeholderTextColor="rgba(223, 226, 238, 0.4)"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                textAlign="right"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                <Icon
                  name={showConfirmPassword ? 'visibility_off' : 'visibility'}
                  size={20}
                  color={THEME.colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Genre Preferences */}
          <GenrePreferenceSelector
            selectedGenres={selectedGenres}
            onToggleGenre={toggleGenre}
          />

          {/* Checkboxes */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreeTerms(!agreeTerms)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkboxBox, agreeTerms && styles.checkboxBoxActive]}>
                {agreeTerms && <Icon name="check" size={14} color="#FFF" strokeWidth={3} />}
              </View>
              <Text style={styles.checkboxText}>
                أوافق على{' '}
                <Text style={styles.linkRed}>شروط الخدمة</Text> و{' '}
                <Text style={styles.linkRed}>سياسة الخصوصية</Text> الخاصة بمنصة ANIME DAZE.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreePromo(!agreePromo)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkboxBox, agreePromo && styles.checkboxBoxActive]}>
                {agreePromo && <Icon name="check" size={14} color="#FFF" strokeWidth={3} />}
              </View>
              <Text style={styles.checkboxText}>
                أرغب في استلام إشعارات صدور الحلقات الأسبوعية وأحدث العروض الحصرية.
              </Text>
            </TouchableOpacity>
          </View>

          {/* Big CTA Button */}
          <TouchableOpacity
            style={[styles.submitButton, submitting && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={submitting}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>إنشاء الحساب والمتابعة</Text>
                <Icon name="rocket_launch" size={22} color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Shared Social Logins */}
          <SocialAuthGrid
            dividerLabel="أو سجّل سريعاً عبر"
            onSelectProvider={handleSocialRegister}
          />
        </View>

        {/* 4. Switch to Login Footer */}
        <View style={styles.footerContainer}>
          <View style={styles.loginRedirectBox}>
            <Text style={styles.loginRedirectPrompt}>لديك حساب بالفعل؟</Text>
            <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
              <Text style={styles.loginRedirectAction}>تسجيل الدخول</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.securityFootnote}>
            <Icon name="verified_user" size={16} color={THEME.colors.secondary} />
            <Text style={styles.securityText}>
              حماية ANIME DAZE • تشفير سحابي آمن 256-bit
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
