import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

interface PasswordStrengthMeterProps {
  password: string;
}

export const calculatePasswordStrength = (pass: string): number => {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return score;
};

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  const strengthMeta = useMemo(() => {
    if (!password) {
      return { text: 'مقياس أمان كلمة المرور', color: THEME.colors.textMuted };
    }
    switch (strength) {
      case 1:
        return { text: 'ضعيفة جداً - أضف أرقاماً ورموزاً', color: THEME.colors.primaryContainer };
      case 2:
        return { text: 'متوسطة - اجعلها أطول', color: THEME.colors.secondary };
      case 3:
        return { text: 'جيدة وقوية', color: THEME.colors.emerald };
      case 4:
        return { text: 'قوية ومحمية بأعلى المعايير 🔥', color: THEME.colors.emerald };
      default:
        return { text: 'مقياس أمان كلمة المرور', color: THEME.colors.textMuted };
    }
  }, [password, strength]);

  return (
    <View style={styles.container}>
      {/* 4-bar strength meter */}
      <View style={styles.strengthMeterContainer}>
        <View
          style={[
            styles.strengthBar,
            strength >= 1 && {
              backgroundColor:
                strength === 1
                  ? THEME.colors.primaryContainer
                  : strength === 2
                  ? THEME.colors.secondary
                  : THEME.colors.emerald,
            },
          ]}
        />
        <View
          style={[
            styles.strengthBar,
            strength >= 2 && {
              backgroundColor: strength === 2 ? THEME.colors.secondary : THEME.colors.emerald,
            },
          ]}
        />
        <View
          style={[
            styles.strengthBar,
            strength >= 3 && { backgroundColor: THEME.colors.emerald },
          ]}
        />
        <View
          style={[
            styles.strengthBar,
            strength >= 4 && { backgroundColor: THEME.colors.emerald },
          ]}
        />
      </View>

      <View style={styles.strengthLabelRow}>
        <Text style={[styles.strengthLabelText, { color: strengthMeta.color }]}>
          {strengthMeta.text}
        </Text>
        <Text style={styles.strengthRequirements}>8+ أحرف • أرقام • رموز</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },
  strengthMeterContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  strengthBar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: THEME.colors.surfaceContainerHighest,
  },
  strengthLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
    marginTop: 4,
  },
  strengthLabelText: {
    fontSize: 11,
    fontWeight: '600',
  },
  strengthRequirements: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
});
