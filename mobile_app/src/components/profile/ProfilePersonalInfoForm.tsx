import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './profile.styles';

interface ProfilePersonalInfoFormProps {
  displayName: string;
  onDisplayNameChange: (text: string) => void;
  handle: string;
  onHandleChange: (text: string) => void;
  gender: 'male' | 'female' | 'unspecified';
  onGenderChange: (gender: 'male' | 'female' | 'unspecified') => void;
}

export const ProfilePersonalInfoForm: React.FC<ProfilePersonalInfoFormProps> = ({
  displayName,
  onDisplayNameChange,
  handle,
  onHandleChange,
  gender,
  onGenderChange,
}) => {
  return (
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
              onChangeText={onDisplayNameChange}
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
              onChangeText={onHandleChange}
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
                onPress={() => onGenderChange(g.key as any)}
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
  );
};
