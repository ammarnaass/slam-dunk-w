import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './profile.styles';

interface ProfileLoginModalProps {
  visible: boolean;
  email: string;
  onEmailChange: (text: string) => void;
  password: string;
  onPasswordChange: (text: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const ProfileLoginModal: React.FC<ProfileLoginModalProps> = ({
  visible,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  onSubmit,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeading}>تسجيل الدخول إلى ANIME DAZE</Text>
            <TouchableOpacity onPress={onClose}>
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
              onChangeText={onEmailChange}
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
              onChangeText={onPasswordChange}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.modalSubmitBtn}
            onPress={onSubmit}
            activeOpacity={0.9}
          >
            <Text style={styles.modalSubmitText}>دخول ومزامنة الحساب</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
