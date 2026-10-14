import React from 'react';
import { View, Text, Image } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { settingsStyles as styles } from './settings.styles';

export const SettingsAccountCard: React.FC = () => {
  return (
    <>
      {/* Intro Banner */}
      <View style={styles.introBanner}>
        <View style={styles.ambientIntroGlow} />
        <View style={styles.introHeaderRow}>
          <Text style={styles.introTitle}>الإعدادات العامة</Text>
          <View style={styles.syncBadge}>
            <View style={styles.syncDot} />
            <Text style={styles.syncText}>مُحدث تلقائياً</Text>
          </View>
        </View>
        <Text style={styles.introSub}>
          تخصيص تجربة البث، العرض واللغات، وإدارة التخزين الفائق.
        </Text>
      </View>

      {/* Account Status Card */}
      <View style={styles.accountCard}>
        <View style={styles.ambientCardGlow} />
        <View style={styles.accountTopRow}>
          <View style={styles.accountUserMeta}>
            <View style={styles.avatarBox}>
              <Image
                source={{
                  uri:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuAEWGv5XHzERPqU79lnkSPK2z5eujB1qG3izV7-UQ2DvZ88yQK5oWBM26uDaR6vxnr7jeqEbFpcrGa_1G0eR0ZDLSOOnOlLABTlWx4kVDXTTrvYoHK4vSGNSv4-O12DSUipKm1WMlwHI8U1LdNW26iASvPWRFIqNHlGhJGutQhF0xfy3XEOBH5r-lAYbayfQpt9dVeX8S94ZJ0NxsXLqKQqODS5feS0AYQVC1qAQQ2wNEB7Q5EqJhFV',
                }}
                style={styles.avatarImg}
              />
            </View>
            <View style={styles.accountTexts}>
              <Text style={styles.accountName}>عمار الناصري</Text>
              <Text style={styles.accountEmail}>ammar@animedaze.app</Text>
            </View>
          </View>

          <View style={styles.vipTagPill}>
            <Icon name="star" size={13} color={THEME.colors.secondary} filled />
            <Text style={styles.vipTagText}>VIP سنوي</Text>
          </View>
        </View>

        <View style={styles.accountStatsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>تاريخ التجديد</Text>
            <Text style={styles.statValueAmber}>24 نوفمبر 2027</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>الأجهزة المتصلة</Text>
            <View style={styles.devicesRow}>
              <Icon name="devices" size={15} color={THEME.colors.primaryContainer} />
              <Text style={styles.statValue}>3 من 5 شاشات</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
