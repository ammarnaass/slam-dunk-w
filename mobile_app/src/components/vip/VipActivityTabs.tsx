import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { vipStyles as styles } from './vip.styles';

interface VipActivityTabsProps {
  activeTab: 'fav' | 'history';
  onTabChange: (tab: 'fav' | 'history') => void;
  onNavigateToAnime?: (animeId: string) => void;
}

export const VipActivityTabs: React.FC<VipActivityTabsProps> = ({
  activeTab,
  onTabChange,
  onNavigateToAnime,
}) => {
  return (
    <View style={styles.tabsSection}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'fav' && styles.tabBtnActive]}
          onPress={() => onTabChange('fav')}
          activeOpacity={0.8}
        >
          <Icon
            name="favorite"
            size={16}
            color={activeTab === 'fav' ? '#FFF' : THEME.colors.textMuted}
            filled
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'fav' && styles.tabBtnTextActive,
            ]}
          >
            المفضلة وقائمتي (3)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'history' && styles.tabBtnActive]}
          onPress={() => onTabChange('history')}
          activeOpacity={0.8}
        >
          <Icon
            name="history"
            size={16}
            color={activeTab === 'history' ? '#FFF' : THEME.colors.textMuted}
          />
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'history' && styles.tabBtnTextActive,
            ]}
          >
            سجل المشاهدة الكامل
          </Text>
        </TouchableOpacity>
      </View>

      {/* Items */}
      <View style={styles.itemsList}>
        {/* Slam Dunk */}
        <TouchableOpacity
          style={styles.animeItemCard}
          onPress={() => onNavigateToAnime?.('slam-dunk')}
          activeOpacity={0.75}
        >
          <Image
            source={{
              uri:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDA4APdvNc-tlKnz6ku8e-cE8SSb9hdIWdw5sdz1nxBduEM_CFr9lAVvAt2cx2ATpg106M436tm4ImjBa2SE3dL1yTl8q5i_5HvMjeB3P5XdrydqO7_oAjTHSHzYYBn7J-DcytGywJdz0rnjpIim_grriAQmM8mtrTAPJgDjgGdWvl2EzFmpcHENDW-No74ze5Du9WxCX0390bVM1zQpxbhRDDnsEwVIvU9JMIKuUX6A2ZID_1ZlLMR',
            }}
            style={styles.animeThumb}
          />
          <View style={styles.animeItemDetails}>
            <View style={styles.animeItemTop}>
              <Text style={styles.animeItemTitle}>سلام دانك (Slam Dunk)</Text>
              <View style={styles.ratingBadge}>
                <Icon name="star" size={13} color={THEME.colors.secondary} filled />
                <Text style={styles.ratingText}>9.2</Text>
              </View>
            </View>
            <Text style={styles.animeItemSub}>101 حلقة كاملة • دبلجة سبيستون الأصلية</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '47%' }]} />
              </View>
              <Text style={styles.progressText}>الحلقة 47 (47%)</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Detective Conan */}
        <TouchableOpacity
          style={styles.animeItemCard}
          onPress={() => onNavigateToAnime?.('detective-conan')}
          activeOpacity={0.75}
        >
          <Image
            source={{
              uri:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuCNj0QwGoT8G0SDtAAbpT0whhCGoUdTIqjl2jOEgNOj54yzGF2t1hgoqGkQElSeSCdGg_ye_KJwX9hYwTzDBc_uwuCVJ0tck-oU-ShVlo7mWh5g56D2FH-bM7EaGVgaocERAQdfrkuay1mfZPSgqI9TgZX_7jk4Sri-nh8THHb1nUL33D4s9QkJTIpNt17_iVcp-BP_H8-jyOIa3-n_bbaz6JBlY5Leqzz7cdvUnlHWEg2M6D1tKZBG',
            }}
            style={styles.animeThumb}
          />
          <View style={styles.animeItemDetails}>
            <View style={styles.animeItemTop}>
              <Text style={styles.animeItemTitle}>المحقق كونان (Detective Conan)</Text>
              <View style={styles.ratingBadge}>
                <Icon name="star" size={13} color={THEME.colors.secondary} filled />
                <Text style={styles.ratingText}>9.5</Text>
              </View>
            </View>
            <Text style={styles.animeItemSub}>أرشيف الزهرة الذهبي • مواسم مختارة</Text>
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '12%' }]} />
              </View>
              <Text style={styles.progressText}>الحلقة 12 (12%)</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
