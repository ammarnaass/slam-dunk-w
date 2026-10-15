import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { registerStyles as styles } from './register.styles';

interface RegisterFieldsProps {
  displayName: string;
  setDisplayName: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
  isMatch: boolean;
  isMismatch: boolean;
}

export const RegisterFields: React.FC<RegisterFieldsProps> = ({
  displayName,
  setDisplayName,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isMatch,
  isMismatch,
}) => {
  return (
    <>
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
    </>
  );
};
