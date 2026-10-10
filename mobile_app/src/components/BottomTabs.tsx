import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../constants/theme';

export type TabType = 'home' | 'episodes' | 'characters' | 'profile';

interface BottomTabsProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'home', label: 'الرئيسية', icon: '🏠' },
    { key: 'episodes', label: 'الحلقات', icon: '🎬' },
    { key: 'characters', label: 'الشخصيات', icon: '🏀' },
    { key: 'profile', label: 'حسابي', icon: '👤' },
  ];

  return (
    <View style={styles.outerContainer}>
      <View style={styles.dockContainer}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => onSelectTab(tab.key)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                <Text style={styles.tabIcon}>
                  {tab.icon}
                </Text>
              </View>
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.md,
    paddingBottom: THEME.spacing.sm,
    paddingTop: 4,
  },
  dockContainer: {
    height: 64,
    backgroundColor: 'rgba(11, 19, 41, 0.95)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeTabButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  activeIconContainer: {
    backgroundColor: THEME.colors.primaryGlow,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  activeTabLabel: {
    color: THEME.colors.white,
    fontWeight: '800',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.primary,
    marginTop: 2,
  },
});
