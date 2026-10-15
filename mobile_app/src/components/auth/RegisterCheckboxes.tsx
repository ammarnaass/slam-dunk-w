import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from '../Icon';
import { registerStyles as styles } from './register.styles';

interface RegisterCheckboxesProps {
  agreeTerms: boolean;
  setAgreeTerms: (val: boolean) => void;
  agreePromo: boolean;
  setAgreePromo: (val: boolean) => void;
}

export const RegisterCheckboxes: React.FC<RegisterCheckboxesProps> = ({
  agreeTerms,
  setAgreeTerms,
  agreePromo,
  setAgreePromo,
}) => {
  return (
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
  );
};
