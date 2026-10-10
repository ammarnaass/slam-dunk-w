import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Linking,
  Modal,
  Alert,
} from 'react-native';
import { THEME } from './src/constants/theme';
import { Header } from './src/components/Header';
import { BottomTabs, TabType } from './src/components/BottomTabs';
import { HomeScreen } from './src/screens/HomeScreen';
import { EpisodesScreen } from './src/screens/EpisodesScreen';
import { CharactersScreen } from './src/screens/CharactersScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { WatchModal } from './src/screens/WatchModal';
import { HomeApiResponse, Episode, Anime, Character } from './src/types';
import { fetchHomeData, fetchEpisodes, fetchCharacters, fetchAppConfig } from './src/services/api';

export default function App(): React.JSX.Element {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [homeData, setHomeData] = useState<HomeApiResponse | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [appConfig, setAppConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [watchModalVisible, setWatchModalVisible] = useState(false);

  // Dev bypass for maintenance mode
  const [devBypassCode, setDevBypassCode] = useState('');
  const [isBypassed, setIsBypassed] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [config, hData, eps, chars] = await Promise.all([
        fetchAppConfig().catch(() => null),
        fetchHomeData().catch(() => null),
        fetchEpisodes('slam-dunk').catch(() => []),
        fetchCharacters().catch(() => []),
      ]);

      if (config) setAppConfig(config);
      if (hData) setHomeData(hData);
      if (chars && chars.length > 0) setCharacters(chars);

      if (eps && eps.length > 0) {
        setEpisodes(eps);
      } else if (hData && hData.latest) {
        setEpisodes(hData.latest);
      }
    } catch (error: any) {
      console.error('App init error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEpisodePress = (ep: Episode) => {
    setSelectedEpisode(ep);
    setWatchModalVisible(true);
  };

  const handleAnimePress = (anime: Anime) => {
    setCurrentTab('episodes');
  };

  const handleHeaderSearch = () => {
    setCurrentTab('episodes');
  };

  const isMaintenanceActive = appConfig?.maintenance?.is_active && !isBypassed;
  const isForceUpdateActive = appConfig?.version_control?.force_update;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Main App Header */}
      <Header
        title={
          currentTab === 'home'
            ? '🏀 سلام دانك'
            : currentTab === 'episodes'
            ? '🎬 جميع الحلقات'
            : currentTab === 'characters'
            ? '🏀 شخصيات شوهوكو'
            : '👤 حسابي والإعدادات'
        }
        onSearchPress={handleHeaderSearch}
        showSearch={currentTab !== 'episodes'}
      />

      {/* Active Screen View */}
      <View style={styles.screenContainer}>
        {currentTab === 'home' && (
          <HomeScreen
            data={homeData}
            loading={loading}
            onRefresh={loadData}
            onEpisodePress={handleEpisodePress}
            onAnimePress={handleAnimePress}
            onViewAllEpisodes={() => setCurrentTab('episodes')}
            characters={characters.length > 0 ? characters : undefined}
          />
        )}

        {currentTab === 'episodes' && (
          <EpisodesScreen
            episodes={episodes}
            loading={loading}
            onSelectEpisode={handleEpisodePress}
          />
        )}

        {currentTab === 'characters' && <CharactersScreen />}

        {currentTab === 'profile' && (
          <ProfileScreen onServerUrlChange={loadData} />
        )}
      </View>

      {/* Episode Player & Servers Modal */}
      <WatchModal
        visible={watchModalVisible}
        episode={selectedEpisode}
        onClose={() => setWatchModalVisible(false)}
      />

      {/* Floating Bottom Navigation */}
      <BottomTabs currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* MAINTENANCE OVERLAY MODAL */}
      <Modal visible={!!isMaintenanceActive} animationType="fade" transparent={false}>
        <View style={styles.maintenanceContainer}>
          <View style={styles.maintenanceCard}>
            <View style={styles.maintenanceIconCircle}>
              <Text style={styles.maintenanceEmoji}>🛠️</Text>
            </View>
            <Text style={styles.maintenanceTitle}>
              {appConfig?.maintenance?.title || 'صيانة دورية مجدولة'}
            </Text>
            <Text style={styles.maintenanceMsg}>
              {appConfig?.maintenance?.message || 'نقوم حالياً بتحسين وتحديث سيرفرات المشاهدة لتوفير تجربة أسرع وأعلى جودة. سنعود خلال وقت قصير!'}
            </Text>

            {appConfig?.maintenance?.estimated_end_time && (
              <View style={styles.timePill}>
                <Text style={styles.timeText}>
                  ⏳ الموعد المتوقع: {appConfig.maintenance.estimated_end_time}
                </Text>
              </View>
            )}

            {/* Dev Bypass Section */}
            <View style={styles.devBypassBox}>
              <Text style={styles.devBypassLabel}>تخطي الصيانة لفريق التطوير:</Text>
              <View style={styles.bypassRow}>
                <TextInput
                  style={styles.bypassInput}
                  placeholder="أدخل كود المطور..."
                  placeholderTextColor="#64748b"
                  value={devBypassCode}
                  onChangeText={setDevBypassCode}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.bypassBtn}
                  onPress={() => {
                    const expectedKey = appConfig?.maintenance?.dev_bypass_key || 'SLAM_DEV_2026';
                    if (devBypassCode.trim() === expectedKey) {
                      setIsBypassed(true);
                    } else {
                      Alert.alert('تنبيه', 'كود المطور غير صحيح');
                    }
                  }}
                >
                  <Text style={styles.bypassBtnText}>دخول</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* FORCE UPDATE MODAL */}
      <Modal visible={!!isForceUpdateActive} animationType="slide" transparent={true}>
        <View style={styles.updateModalOverlay}>
          <View style={styles.updateCard}>
            <Text style={styles.updateEmoji}>🚀</Text>
            <Text style={styles.updateTitle}>تحديث إجباري جديد متاح!</Text>
            <Text style={styles.updateMsg}>
              يتوفر إصدار أحدث ({appConfig?.version_control?.latest_version || '1.2.0'}) يحتوي على تحسينات هامة لسيرفرات البث وجودة الفيديو. يرجى التحديث للمتابعة.
            </Text>

            <TouchableOpacity
              style={styles.updateBtn}
              onPress={() => {
                const url = appConfig?.version_control?.direct_apk_url || appConfig?.version_control?.store_url;
                if (url) Linking.openURL(url);
              }}
            >
              <Text style={styles.updateBtnText}>تحميل التحديث الآن 📥</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  maintenanceContainer: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  maintenanceCard: {
    backgroundColor: '#0b1329',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  maintenanceIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  maintenanceEmoji: {
    fontSize: 34,
  },
  maintenanceTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  maintenanceMsg: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  timePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  timeText: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
  },
  devBypassBox: {
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  devBypassLabel: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 6,
    textAlign: 'right',
  },
  bypassRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bypassInput: {
    flex: 1,
    backgroundColor: '#020617',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 12,
  },
  bypassBtn: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bypassBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  updateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  updateCard: {
    backgroundColor: '#0b1329',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.4)',
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  updateEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  updateMsg: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  updateBtn: {
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  updateBtnText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
  },
});
