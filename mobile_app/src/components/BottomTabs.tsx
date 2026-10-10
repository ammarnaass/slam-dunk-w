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
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabButton}
            onPress={() => onSelectTab(tab.key)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
              <Text style={[styles.tabIcon, isActive && styles.activeTabIcon]}>
                {tab.icon}
              </Text>
            </View>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
  },
  tabIcon: {
    fontSize: 18,
  },
  activeTabIcon: {
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 11,
    color: THEME.colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: THEME.colors.primaryLight,
    fontWeight: 'bold',
  },
});
