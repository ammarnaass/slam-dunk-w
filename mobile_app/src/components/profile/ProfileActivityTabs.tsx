import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './profile.styles';

interface ProfileActivityTabsProps {
  activeTab: 'fav' | 'history';
  onTabChange: (tab: 'fav' | 'history') => void;
  favorites?: any[];
  continueWatching?: any[];
  onEpisodePress?: (ep: any) => void;
}

export const ProfileActivityTabs: React.FC<ProfileActivityTabsProps> = ({
  activeTab,
  onTabChange,
  favorites = [],
  continueWatching = [],
  onEpisodePress,
}) => {
  const favCount = favorites.length > 0 ? favorites.length : 2;

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
            المفضلة وقائمتي ({favCount})
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
            سجل المشاهدة {continueWatching.length > 0 ? `(${continueWatching.length})` : 'الكامل'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: Favorites List */}
      {activeTab === 'fav' ? (
        <View style={styles.listContainer}>
          {favorites.length > 0 ? (
            favorites.map((fav, idx) => (
              <View key={fav.id || idx} style={styles.favListItem}>
                <Image
                  source={{
                    uri:
                      fav.coverImage ||
                      fav.thumbnail ||
                      (idx % 2 === 0
                        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDA4APdvNc-tlKnz6ku8e-cE8SSb9hdIWdw5sdz1nxBduEM_CFr9lAVvAt2cx2ATpg106M436tm4ImjBa2SE3dL1yTl8q5i_5HvMjeB3P5XdrydqO7_oAjTHSHzYYBn7J-DcytGywJdz0rnjpIim_grriAQmM8mtrTAPJgDjgGdWvl2EzFmpcHENDW-No74ze5Du9WxCX0390bVM1zQpxbhRDDnsEwVIvU9JMIKuUX6A2ZID_1ZlLMR'
                        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFZePy18zXlyvf-zAvSXGoKcybY45ItTYs8cbq0s47cObB1bfayCp7Rz610PV-B983leQAfWvmC5lCu5F8LZ8ZIVwj6Ojl3osKyhYbmGjrkDI67cTa5sLZHYQrBgGmPTbgfuw5vTahhIlvuYOTMgXRTQLEED6ce8P4SBEW4R_DI0glnTn7ujMRunxpaeEsq5xgLcVFk2lZ5XRGNDZXp6dBocZa1vkgbDrRGBsHQophqvIL0foe7cHn'),
                  }}
                  style={styles.favThumb}
                  resizeMode="cover"
                />
                <View style={styles.favMeta}>
                  <View style={styles.favTitleRow}>
                    <Text style={styles.favTitle}>
                      {fav.title || (typeof fav === 'string' ? fav : 'عمل مفضل')}
                    </Text>
                    <View style={styles.favRating}>
                      <Icon name="star" size={13} color={THEME.colors.secondary} filled />
                      <Text style={styles.favRatingText}>{fav.rating || '9.2'}</Text>
                    </View>
                  </View>
                  <Text style={styles.favSub}>{fav.type === 'episode' ? 'حلقة محفوظة' : 'أنمي محفوظ في القائمة'}</Text>
                </View>
              </View>
            ))
          ) : (
            <>
              {/* Default Slam Dunk Item */}
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

              {/* Default Conan Item */}
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
            </>
          )}
        </View>
      ) : (
        <View style={styles.listContainer}>
          {continueWatching.length > 0 ? (
            continueWatching.map((item, idx) => (
              <TouchableOpacity
                key={item.episodeId || idx}
                style={styles.favListItem}
                onPress={() => onEpisodePress?.(item)}
                activeOpacity={0.8}
              >
                <View style={styles.historyTimeIcon}>
                  <Icon name="play_arrow" size={20} color={THEME.colors.primaryContainer} filled />
                </View>
                <View style={styles.favMeta}>
                  <Text style={styles.favTitle}>
                    {item.anime?.title ? `${item.anime.title} - ` : ''}
                    {item.episode?.title || `الحلقة ${item.episode?.episodeNumber || ''}`}
                  </Text>
                  <Text style={styles.favSub}>
                    شوهد {item.percentage || 50}% • انقر للمتابعة
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.favListItem}>
              <View style={styles.historyTimeIcon}>
                <Icon name="play_arrow" size={20} color={THEME.colors.primaryContainer} filled />
              </View>
              <View style={styles.favMeta}>
                <Text style={styles.favTitle}>سلام دانك - الحلقة 47</Text>
                <Text style={styles.favSub}>شوهد 65% • قبل يومين</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

