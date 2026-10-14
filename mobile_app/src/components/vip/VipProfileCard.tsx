import React from 'react';
import { View, Text, Image } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { UserProfile } from '../../types';
import { vipStyles as styles } from './vip.styles';

interface VipProfileCardProps {
  user?: UserProfile | null;
}

export const VipProfileCard: React.FC<VipProfileCardProps> = ({ user }) => {
  return (
    <View style={styles.profileCard}>
      <View style={styles.ambientProfileGlow1} />
      <View style={styles.ambientProfileGlow2} />

      <View style={styles.profileTopRow}>
        {/* Glowing Avatar Frame */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarGlowRing} />
          <Image
            source={{
              uri:
                user?.avatar ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBI498UUiI2QFIQ-FoFKi-V5IrzGQESamESSNyX71xRCD-FZ2ygead9BNCHV1gvtOs3hTU5cKMAT4Uu77Z3oWDo5G4a1rLWwCyuLp6OkACKfiJLt8R23_JWqPNlbADnK6FOffLZM1QhbkE7yBMD8vDCP_ztTNIDilNPjZutINZk-LYUVaaIN0bFUKmwjKDgBS4AGPcLv0deGA5QXXK1rgwFOsVJtzgsrQ_WcTTUjUXSdjJAq3eqejBp',
            }}
            style={styles.avatarImg}
          />
          <View style={styles.avatarVipTag}>
            <Icon name="stars" size={11} color="#472A00" filled />
            <Text style={styles.avatarVipTagText}>VIP</Text>
          </View>
        </View>

        {/* User Meta */}
        <View style={styles.userMeta}>
          <Text style={styles.userName} numberOfLines={1}>
            {user?.name || 'عمار الناصري (Ammar_Otaku)'}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user?.email || 'ammar@animedaze.app'}
          </Text>

          {/* Status Pill */}
          <View style={styles.statusPill}>
            <Icon name="workspace_premium" size={14} color={THEME.colors.secondary} filled />
            <Text style={styles.statusPillText}>عضو VIP ذهبي • التجديد 15 أبريل 2027</Text>
          </View>
        </View>
      </View>

      {/* Quick Metrics Bento Grid */}
      <View style={styles.bentoGrid}>
        <View style={styles.bentoCol}>
          <Text style={[styles.bentoValue, { color: THEME.colors.primaryContainer }]}>142</Text>
          <Text style={styles.bentoLabel}>حلقة تمت مشاهدتها</Text>
        </View>
        <View style={styles.bentoCol}>
          <Text style={[styles.bentoValue, { color: THEME.colors.secondary }]}>18</Text>
          <Text style={styles.bentoLabel}>أنمي في المفضلة</Text>
        </View>
        <View style={styles.bentoCol}>
          <Text style={[styles.bentoValue, { color: THEME.colors.tertiaryContainer }]}>29</Text>
          <Text style={styles.bentoLabel}>تقييم وتعليق</Text>
        </View>
      </View>
    </View>
  );
};
