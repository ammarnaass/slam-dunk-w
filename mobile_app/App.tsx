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
  LogBox,
} from 'react-native';

LogBox.ignoreAllLogs();
import { THEME } from './src/constants/theme';
import { Header } from './src/components/Header';
import { BottomTabs, TabType } from './src/components/BottomTabs';
import { HomeScreen } from './src/screens/HomeScreen';
import { AnimesScreen } from './src/screens/AnimesScreen';
import { EpisodesScreen } from './src/screens/EpisodesScreen';
import { CharactersScreen } from './src/screens/CharactersScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { DownloadsScreen } from './src/screens/DownloadsScreen';
import { WatchModal } from './src/screens/WatchModal';
import { HomeApiResponse, Episode, Anime, Character } from './src/types';
import {
  fetchHomeData,
  fetchEpisodes,
  fetchCharacters,
  fetchAppConfig,
  fetchAnimes,
} from './src/services/api';
import { Icon } from './src/components/Icon';

export default function App(): React.JSX.Element {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [homeData, setHomeData] = useState<HomeApiResponse | null>(null);
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [appConfig, setAppConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [watchModalVisible, setWatchModalVisible] = useState(false);

  // Dev bypass for maintenance mode
  const [devBypassCode, setDevBypassCode] = useState('');
  const [isBypassed, setIsBypassed] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [config, hData, eps, chars, anims] = await Promise.all([
        fetchAppConfig().catch(() => null),
        fetchHomeData().catch(() => null),
        fetchEpisodes('slam-dunk').catch(() => []),
        fetchCharacters().catch(() => []),
        fetchAnimes().catch(() => []),
      ]);

      if (config) setAppConfig(config);
      if (hData) setHomeData(hData);
      if (chars && chars.length > 0) setCharacters(chars);

      if (anims && anims.length > 0) {
        setAnimes(anims);
      } else if (hData?.slider && hData.slider.length > 0) {
        setAnimes(hData.slider);
      }

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

  const handleNextEpisode = () => {
    if (!selectedEpisode || episodes.length === 0) return;
    const currentIdx = episodes.findIndex((e) => e.id === selectedEpisode.id);
    if (currentIdx !== -1 && currentIdx < episodes.length - 1) {
      setSelectedEpisode(episodes[currentIdx + 1]);
    } else {
      Alert.alert('نهاية السلسلة', 'لقد وصلت لآخر حلقة متوفرة في هذا القسم!');
    }
  };

  const handleAnimePress = async (anime: Anime) => {
    setSelectedAnime(anime);
    setCurrentTab('animes');
    try {
      const eps = await fetchEpisodes(anime.id);
      if (eps && eps.length > 0) {
        setEpisodes(eps);
      }
    } catch (_) {}
  };

  const handleHeaderSearch = () => {
    setSelectedAnime(null);
    setCurrentTab('animes');
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === 'animes') {
      setSelectedAnime(null);
    }
    setCurrentTab(tab);
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
            ? 'ANIME DAZE'
            : currentTab === 'animes'
            ? selectedAnime ? selectedAnime.title : 'دليل الأنمي'
            : currentTab === 'episodes'
            ? 'استكشاف الأنمي'
            : currentTab === 'downloads'
            ? 'إدارة التنزيلات'
            : currentTab === 'characters'
            ? 'شخصيات الأنمي'
            : 'حسابي والإعدادات'
        }
        onSearchPress={handleHeaderSearch}
        showSearch={currentTab !== 'animes' && currentTab !== 'episodes'}
        onVipPress={() => setCurrentTab('profile')}
        onNotificationPress={() => {
          Alert.alert('الإشعارات', 'لا توجد إشعارات جديدة حالياً، أنت مطلع على أحدث الحلقات!');
        }}
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
            onViewAllAnimes={() => {
              setSelectedAnime(null);
              setCurrentTab('animes');
            }}
            characters={characters.length > 0 ? characters : undefined}
          />
        )}

        {currentTab === 'animes' && (
          <AnimesScreen
            animes={animes}
            episodes={episodes}
            loading={loading}
            onRefresh={loadData}
            onSelectAnime={handleAnimePress}
            selectedAnime={selectedAnime}
            onBackToCatalog={() => setSelectedAnime(null)}
            onSelectEpisode={handleEpisodePress}
          />
        )}

        {currentTab === 'episodes' && (
          <EpisodesScreen
            episodes={episodes}
            loading={loading}
            onSelectEpisode={handleEpisodePress}
            onBack={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'downloads' && (
          <DownloadsScreen
            onPlayEpisode={handleEpisodePress}
            onBack={() => setCurrentTab('profile')}
          />
        )}

        {currentTab === 'characters' && (
          <CharactersScreen onBack={() => setCurrentTab('home')} />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen onServerUrlChange={loadData} />
        )}
      </View>

      {/* Episode Player & Servers Modal */}
      <WatchModal
        visible={watchModalVisible}
        episode={selectedEpisode}
        onClose={() => setWatchModalVisible(false)}
        onNextEpisode={handleNextEpisode}
      />

      {/* Floating Bottom Navigation */}
      <BottomTabs currentTab={currentTab} onSelectTab={handleTabChange} />

      {/* MAINTENANCE OVERLAY MODAL */}
      <Modal visible={!!isMaintenanceActive} animationType="fade" transparent={false}>
        <View style={styles.maintenanceContainer}>
          <View style={styles.maintenanceCard}>
            <View style={styles.maintenanceIconCircle}>
              <Icon name="tool" size={32} color={THEME.colors.secondaryContainer} />
            </View>
            <Text style={styles.maintenanceTitle}>
              {appConfig?.maintenance?.title || 'صيانة دورية مجدولة'}
            </Text>
            <Text style={styles.maintenanceMsg}>
              {appConfig?.maintenance?.message ||
                'نقوم حالياً بتحسين وتحديث سيرفرات المشاهدة لتوفير تجربة أسرع وأعلى جودة بدون تقطيع. سنعود خلال وقت قصير!'}
            </Text>

            {appConfig?.maintenance?.estimated_end_time && (
              <View style={styles.timePill}>
                <Text style={styles.timeText}>
                  الموعد المتوقع: {appConfig.maintenance.estimated_end_time}
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
                  placeholderTextColor={THEME.colors.onSurfaceVariant}
                  value={devBypassCode}
                  onChangeText={setDevBypassCode}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.bypassBtn}
                  onPress={() => {
                    const expectedKey =
                      appConfig?.maintenance?.dev_bypass_key || 'SLAM_DEV_2026';
                    if (devBypassCode.trim() === expectedKey) {
                      setIsBypassed(true);
                    } else {
                      Alert.alert('تنبيه', 'كود المطور غير صحيح');
                    }
                  }}
                  activeOpacity={0.8}
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
            <View style={styles.updateIconCircle}>
              <Icon
                name="sparkles"
                size={34}
                color={THEME.colors.primaryContainer}
                filled
              />
            </View>
            <Text style={styles.updateTitle}>تحديث إجباري جديد متاح!</Text>
            <Text style={styles.updateMsg}>
              يتوفر إصدار أحدث ({appConfig?.version_control?.latest_version || '1.2.0'}) يحتوي على تحسينات هامة لسيرفرات البث وجودة الفيديو. يرجى التحديث للمتابعة.
            </Text>

            <TouchableOpacity
              style={styles.updateBtn}
              onPress={() => {
                const url =
                  appConfig?.version_control?.direct_apk_url ||
                  appConfig?.version_control?.store_url;
                if (url) Linking.openURL(url);
              }}
              activeOpacity={0.8}
            >
              <Icon name="download" size={16} color="#FFFFFF" />
              <Text style={styles.updateBtnText}>تحميل التحديث الآن</Text>
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
    backgroundColor: THEME.colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  maintenanceCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  maintenanceIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(238, 152, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  maintenanceTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  maintenanceMsg: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  timePill: {
    backgroundColor: 'rgba(238, 152, 0, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.DEFAULT,
    marginBottom: 20,
  },
  timeText: {
    color: THEME.colors.secondary,
    ...THEME.typography.labelSm,
    fontWeight: '700',
  },
  devBypassBox: {
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  devBypassLabel: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginBottom: 6,
    textAlign: 'right',
  },
  bypassRow: {
    flexDirection: 'row',
    gap: 8,
  },
  bypassInput: {
    flex: 1,
    backgroundColor: THEME.colors.surfaceContainerLowest,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: THEME.colors.onSurface,
    ...THEME.typography.bodySm,
  },
  bypassBtn: {
    backgroundColor: THEME.colors.primaryContainer,
    borderRadius: THEME.radius.lg,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bypassBtnText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '800',
  },
  updateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 22, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  updateCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  updateIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  updateTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  updateMsg: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  updateBtn: {
    backgroundColor: THEME.colors.primaryContainer,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: THEME.radius.lg,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: THEME.colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  updateBtnText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '900',
  },
});
