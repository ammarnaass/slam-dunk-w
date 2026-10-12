import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './profile.styles';

interface ProfileAccountActionsProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onShareProfile: () => void;
}

export const ProfileAccountActions: React.FC<ProfileAccountActionsProps> = ({
  isLoggedIn,
  onLogin,
  onLogout,
  onShareProfile,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.accountActionsRow}>
        {isLoggedIn ? (
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={onLogout}
            activeOpacity={0.8}
          >
            <Icon name="trash" size={18} color={THEME.colors.error} />
            <Text style={styles.logoutText}>تسجيل الخروج من الحساب</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={onLogin}
            activeOpacity={0.8}
          >
            <Icon name="person" size={18} color={THEME.colors.white} />
            <Text style={styles.loginText}>تسجيل الدخول / إنشاء حساب</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.shareProfileBtn}
          onPress={onShareProfile}
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
  );
};
