import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './profile.styles';

interface ProfileActivityTabsProps {
  activeTab: 'fav' | 'history';
  onTabChange: (tab: 'fav' | 'history') => void;
}

export const ProfileActivityTabs: React.FC<ProfileActivityTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.section}>
      <View style={styles.tabsSwitcher}>
        <TouchableOpacity
          style={[
            styles.tabSwitchBtn,
            activeTab === 'fav' && styles.tabSwitchBtnActive,
          ]}
          onPress={() => onTabChange('fav')}
          activeOpacity={0.8}
        >
          <Icon
            name="favorite"
            size={16}
            color={
              activeTab === 'fav'
                ? THEME.colors.onPrimaryContainer
                : THEME.colors.onSurfaceVariant
            }
          />
          <Text
            style={[
              styles.tabSwitchText,
              activeTab === 'fav' && styles.tabSwitchTextActive,
            ]}
          >
            المفضلة وقائمتي (3)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabSwitchBtn,
            activeTab === 'history' && styles.tabSwitchBtnActive,
          ]}
          onPress={() => onTabChange('history')}
          activeOpacity={0.8}
        >
          <Icon
            name="history"
            size={16}
            color={
              activeTab === 'history'
                ? THEME.colors.onPrimaryContainer
                : THEME.colors.onSurfaceVariant
            }
          />
          <Text
            style={[
              styles.tabSwitchText,
              activeTab === 'history' && styles.tabSwitchTextActive,
            ]}
          >
            سجل المشاهدة الكامل
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: Favorites List */}
      {activeTab === 'fav' ? (
        <View style={styles.listContainer}>
          {/* Slam Dunk Item */}
          <View style={styles.favListItem}>
            <Image
              source={{
                uri:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDA4APdvNc-tlKnz6ku8e-cE8SSb9hdIWdw5sdz1nxBduEM_CFr9lAVvAt2cx2ATpg106M436tm4ImjBa2SE3dL1yTl8q5i_5HvMjeB3P5XdrydqO7_oAjTHSHzYYBn7J-DcytGywJdz0rnjpIim_grriAQmM8mtrTAPJgDjgGdWvl2EzFmpcHENDW-No74ze5Du9WxCX0390bVM1zQpxbhRDDnsEwVIvU9JMIKuUX6A2ZID_1ZlLMR',
              }}
              style={styles.favThumb}
              resizeMode="cover"
            />
            <View style={styles.favMeta}>
              <View style={styles.favTitleRow}>
                <Text style={styles.favTitle}>سلام دانك (Slam Dunk)</Text>
                <View style={styles.favRating}>
                  <Icon name="star" size={13} color={THEME.colors.secondary} filled />
                  <Text style={styles.favRatingText}>9.4</Text>
                </View>
              </View>
              <Text style={styles.favSub}>رياضي • 101 حلقة • مكتمل</Text>
            </View>
          </View>

          {/* Conan Item */}
          <View style={styles.favListItem}>
            <Image
              source={{
                uri:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBFZePy18zXlyvf-zAvSXGoKcybY45ItTYs8cbq0s47cObB1bfayCp7Rz610PV-B983leQAfWvmC5lCu5F8LZ8ZIVwj6Ojl3osKyhYbmGjrkDI67cTa5sLZHYQrBgGmPTbgfuw5vTahhIlvuYOTMgXRTQLEED6ce8P4SBEW4R_DI0glnTn7ujMRunxpaeEsq5xgLcVFk2lZ5XRGNDZXp6dBocZa1vkgbDrRGBsHQophqvIL0foe7cHn',
              }}
              style={styles.favThumb}
              resizeMode="cover"
            />
            <View style={styles.favMeta}>
              <View style={styles.favTitleRow}>
                <Text style={styles.favTitle}>المحقق كونان</Text>
                <View style={styles.favRating}>
                  <Icon name="star" size={13} color={THEME.colors.secondary} filled />
                  <Text style={styles.favRatingText}>8.9</Text>
                </View>
              </View>
              <Text style={styles.favSub}>غموض • +1100 حلقة • مستمر</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <View style={styles.favListItem}>
            <View style={styles.historyTimeIcon}>
              <Icon name="play_arrow" size={20} color={THEME.colors.primaryContainer} filled />
            </View>
            <View style={styles.favMeta}>
              <Text style={styles.favTitle}>سلام دانك - الحلقة 47</Text>
              <Text style={styles.favSub}>شوهد 65% • قبل يومين</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
