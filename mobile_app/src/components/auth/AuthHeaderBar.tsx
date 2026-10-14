import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';

interface AuthHeaderBarProps {
  onBack?: () => void;
}

export const AuthHeaderBar: React.FC<AuthHeaderBarProps> = ({ onBack }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon name="arrow_forward" size={22} color={THEME.colors.onSurface} />
      </TouchableOpacity>

      <View style={styles.brandContainer}>
        <View style={styles.brandGlowDot} />
        <Text style={styles.brandText}>
          ANIME <Text style={styles.brandRed}>DAZE</Text>
        </Text>
      </View>

      <View style={styles.headerUserCircle}>
        <Icon name="person" size={18} color={THEME.colors.primaryContainer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(15, 19, 28, 0.96)',
    zIndex: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandGlowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.colors.primaryContainer,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '900',
    color: THEME.colors.onSurface,
    letterSpacing: 1.5,
  },
  brandRed: {
    color: THEME.colors.primaryContainer,
  },
  headerUserCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
});
