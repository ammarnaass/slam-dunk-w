import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Icon } from '../components/Icon';
import {
  AuthHeaderBar,
  RegisterHeroSection,
  RegisterFields,
  GenrePreferenceSelector,
  RegisterCheckboxes,
  SocialAuthGrid,
  RegisterFooter,
  useRegisterForm,
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
  const form = useRegisterForm({ onSuccess });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* 1. Top Navigation Bar */}
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

        {/* 2. Hero Headline & Feature Badges */}
        <RegisterHeroSection />

        {/* 3. Form Section */}
        <View style={styles.formContainer}>
          <RegisterFields
            displayName={form.displayName}
            setDisplayName={form.setDisplayName}
            username={form.username}
            setUsername={form.setUsername}
            email={form.email}
            setEmail={form.setEmail}
            password={form.password}
            setPassword={form.setPassword}
            confirmPassword={form.confirmPassword}
            setConfirmPassword={form.setConfirmPassword}
            showPassword={form.showPassword}
            setShowPassword={form.setShowPassword}
            showConfirmPassword={form.showConfirmPassword}
            setShowConfirmPassword={form.setShowConfirmPassword}
            isMatch={form.isMatch}
            isMismatch={form.isMismatch}
          />

          {/* Genre Preferences */}
          <GenrePreferenceSelector
            selectedGenres={form.selectedGenres}
            onToggleGenre={form.toggleGenre}
          />

          {/* Terms & Promo Checkboxes */}
          <RegisterCheckboxes
            agreeTerms={form.agreeTerms}
            setAgreeTerms={form.setAgreeTerms}
            agreePromo={form.agreePromo}
            setAgreePromo={form.setAgreePromo}
          />

          {/* Big CTA Button */}
          <TouchableOpacity
            style={[styles.submitButton, form.submitting && { opacity: 0.7 }]}
            onPress={form.handleRegister}
            disabled={form.submitting}
            activeOpacity={0.85}
          >
            {form.submitting ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>إنشاء الحساب والمتابعة</Text>
                <Icon name="rocket_launch" size={22} color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Social Logins */}
          <SocialAuthGrid
            dividerLabel="أو سجّل سريعاً عبر"
            onSelectProvider={form.handleSocialRegister}
          />
        </View>

        {/* 4. Switch to Login & Security Footnote */}
        <RegisterFooter onNavigateToLogin={onNavigateToLogin} />
      </ScrollView>
    </View>
  );
};
