import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { THEME } from '../constants/theme';
import { Icon, IconName } from './Icon';

export type TabType = 'home' | 'animes' | 'episodes' | 'downloads' | 'characters' | 'profile';

interface TabDef {
  key: TabType;
  label: string;
  icon: IconName;
}

const TABS: TabDef[] = [
  { key: 'home', label: 'الرئيسية', icon: 'home' },
  { key: 'animes', label: 'دليل الأنمي', icon: 'video_library' },
  { key: 'episodes', label: 'استكشاف', icon: 'explore' },
  { key: 'profile', label: 'حسابي', icon: 'person' },
];

interface BottomTabsProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({
  currentTab,
  onSelectTab,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive =
            currentTab === tab.key ||
            (tab.key === 'animes' && currentTab === 'characters') ||
            (tab.key === 'profile' && currentTab === 'downloads');

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => onSelectTab(tab.key)}
              activeOpacity={0.7}
              accessibilityLabel={tab.label}
            >
              <View
                style={[
                  styles.iconCapsule,
                  isActive && styles.iconCapsuleActive,
                ]}
              >
                <Icon
                  name={tab.icon}
                  size={24}
                  color={
                    isActive
                      ? THEME.colors.primaryContainer
                      : THEME.colors.onSurfaceVariant
                  }
                  filled={isActive}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  isActive && styles.labelActive,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.dockBg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingBottom: Platform.OS === 'ios' ? 16 : 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 16,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    paddingHorizontal: THEME.spacing.spaceSm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconCapsule: {
    width: 44,
    height: 30,
    borderRadius: THEME.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconCapsuleActive: {
    backgroundColor: 'rgba(220, 38, 38, 0.18)',
  },
  label: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    letterSpacing: -0.2,
  },
  labelActive: {
    color: THEME.colors.primaryContainer,
    fontWeight: '700',
  },
});
