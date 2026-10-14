import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

interface SocialAuthGridProps {
  dividerLabel?: string;
  onSelectProvider: (provider: string) => void;
}

export const SocialAuthGrid: React.FC<SocialAuthGridProps> = ({
  dividerLabel = 'أو واصل سريعاً عبر',
  onSelectProvider,
}) => {
  return (
    <View style={styles.container}>
      {/* Social Divider */}
      <View style={styles.socialDividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>{dividerLabel}</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social Buttons */}
      <View style={styles.socialGrid}>
        <TouchableOpacity
          style={styles.socialBtn}
          onPress={() => onSelectProvider('Google')}
          activeOpacity={0.75}
        >
          <Text style={styles.socialIconText}>G</Text>
          <Text style={styles.socialBtnText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialBtn}
          onPress={() => onSelectProvider('Apple')}
          activeOpacity={0.75}
        >
          <Text style={styles.socialIconText}></Text>
          <Text style={styles.socialBtnText}>Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialBtn}
          onPress={() => onSelectProvider('Discord')}
          activeOpacity={0.75}
        >
          <Text style={[styles.socialIconText, { color: '#5865F2' }]}>👾</Text>
          <Text style={styles.socialBtnText}>Discord</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  socialDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  dividerText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
  },
  socialGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  socialBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: THEME.colors.surfaceContainerLow,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  socialIconText: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.onSurface,
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.colors.onSurface,
  },
});
