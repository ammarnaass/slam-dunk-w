import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../constants/theme';

interface HeaderProps {
  title?: string;
  onSearchPress?: () => void;
  showSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = '🏀 سلام دانك',
  onSearchPress,
  showSearch = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.badgeIndicator} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {showSearch && (
        <TouchableOpacity
          style={styles.searchButton}
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <Text style={styles.searchIconText}>🔍</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: THEME.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.cardBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  badgeIndicator: {
    width: 4,
    height: 22,
    backgroundColor: THEME.colors.primary,
    borderRadius: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.colors.white,
    letterSpacing: 0.5,
  },
  searchButton: {
    width: 38,
    height: 38,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.card,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIconText: {
    fontSize: 16,
  },
});
