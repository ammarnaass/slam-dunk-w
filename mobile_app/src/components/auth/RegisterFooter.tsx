import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { registerStyles as styles } from './register.styles';

interface RegisterFooterProps {
  onNavigateToLogin?: () => void;
}

export const RegisterFooter: React.FC<RegisterFooterProps> = ({
  onNavigateToLogin,
}) => {
  return (
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
  );
};
