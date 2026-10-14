import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { THEME } from '../constants/theme';
import { Icon, IconName } from '../components/Icon';

const TAB_METADATA: Record<string, { label: string; icon: IconName }> = {
  Home: { label: 'الرئيسية', icon: 'home' },
  Animes: { label: 'دليل الأنمي', icon: 'video_library' },
  Episodes: { label: 'استكشاف', icon: 'explore' },
  Profile: { label: 'حسابي', icon: 'person' },
};

interface CustomBottomTabBarProps {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
  state?: any;
  descriptors?: any;
  navigation?: any;
}

export const CustomBottomTabBar: React.FC<CustomBottomTabBarProps> = ({
  activeTab,
  onTabPress,
  state,
  descriptors,
  navigation,
}) => {
  const insetsContext = useContext(SafeAreaInsetsContext);
  const insets = insetsContext ?? { top: 0, bottom: 0, left: 0, right: 0 };
  const currentTab = activeTab || (state ? state.routes[state.index]?.name : 'Home');
  const tabs = ['Home', 'Animes', 'Episodes', 'Profile'];

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 10) }]}>
      <View style={styles.tabRow}>
        {(state ? state.routes.map((r: any) => r.name) : tabs).map((tabName: string) => {
          const isFocused = currentTab === tabName;
          const meta = TAB_METADATA[tabName] || { label: tabName, icon: 'home' };

          const onPress = () => {
            if (onTabPress) {
              onTabPress(tabName);
            } else if (navigation) {
              navigation.navigate(tabName);
            }
          };

          return (
            <TouchableOpacity
              key={tabName}
              style={styles.tab}
              onPress={onPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={meta.label}
            >
              <View
                style={[
                  styles.iconCapsule,
                  isFocused && styles.iconCapsuleActive,
                ]}
              >
                <Icon
                  name={meta.icon}
                  size={24}
                  color={
                    isFocused
                      ? THEME.colors.primaryContainer
                      : THEME.colors.onSurfaceVariant
                  }
                  filled={isFocused}
                />
              </View>
              <Text
                style={[
                  styles.label,
                  isFocused && styles.labelActive,
                ]}
                numberOfLines={1}
              >
                {meta.label}
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
