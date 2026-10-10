import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
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
import { HomeApiResponse, Episode, Anime } from './src/types';
import { fetchHomeData, fetchEpisodes } from './src/services/api';

export default function App(): React.JSX.Element {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [homeData, setHomeData] = useState<HomeApiResponse | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [watchModalVisible, setWatchModalVisible] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [hData, eps] = await Promise.all([
        fetchHomeData().catch(() => null),
        fetchEpisodes('slam-dunk').catch(() => []),
      ]);

      if (hData) setHomeData(hData);
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

      {/* Bottom Navigation */}
      <BottomTabs currentTab={currentTab} onSelectTab={setCurrentTab} />
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
});
