import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { AnimesScreen } from '../screens/AnimesScreen';
import { EpisodesScreen } from '../screens/EpisodesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CharactersScreen } from '../screens/CharactersScreen';
import { DownloadsScreen } from '../screens/DownloadsScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { VipScreen } from '../screens/VipScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { OfflineScreen } from '../screens/OfflineScreen';
import { CustomBottomTabBar } from './BottomTabBar';
import { useAppStore } from '../store/useAppStore';
import { THEME } from '../constants/theme';

export interface NavigationProp {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  replace: (screen: string, params?: any) => void;
}

const NavigationContext = createContext<NavigationProp>({
  navigate: () => {},
  goBack: () => {},
  replace: () => {},
});

export const useNavigation = () => useContext(NavigationContext);

const TAB_NAMES = ['Home', 'Animes', 'Episodes', 'Profile'];

export function AppNavigator() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Animes' | 'Episodes' | 'Profile'>('Home');
  const [stack, setStack] = useState<string[]>(['MainTabs']);

  const {
    homeData,
    loading,
    characters,
    animes,
    episodes,
    selectedAnime,
    loadData,
    handleEpisodePress,
    handleAnimePress,
    setSelectedAnime,
  } = useAppStore();

  const currentScreen = stack[stack.length - 1] || 'MainTabs';

  const navigate = useCallback((screen: string) => {
    if (TAB_NAMES.includes(screen)) {
      setActiveTab(screen as any);
      setStack(['MainTabs']);
    } else {
      setStack((prev) => [...prev, screen]);
    }
  }, []);

  const goBack = useCallback(() => {
    setStack((prev) => {
      if (prev.length > 1) {
        return prev.slice(0, prev.length - 1);
      }
      return prev;
    });
  }, []);

  const replace = useCallback((screen: string) => {
    if (TAB_NAMES.includes(screen)) {
      setActiveTab(screen as any);
      setStack(['MainTabs']);
    } else {
      setStack((prev) => {
        const next = [...prev];
        next[next.length - 1] = screen;
        return next;
      });
    }
  }, []);

  useEffect(() => {
    const handleHardwareBack = () => {
      if (stack.length > 1) {
        goBack();
        return true;
      }
      return false;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', handleHardwareBack);
    return () => sub.remove();
  }, [stack.length, goBack]);

  const navObj: NavigationProp = { navigate, goBack, replace };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'Characters':
        return <CharactersScreen onBack={goBack} />;
      case 'Downloads':
        return <DownloadsScreen onPlayEpisode={handleEpisodePress} onBack={goBack} />;
      case 'Register':
        return (
          <RegisterScreen
            onBack={goBack}
            onNavigateToLogin={() => replace('Login')}
            onSuccess={goBack}
          />
        );
      case 'Login':
        return (
          <LoginScreen
            onBack={goBack}
            onNavigateToRegister={() => replace('Register')}
            onSuccess={goBack}
            onSkipGuest={goBack}
          />
        );
      case 'Vip':
        return <VipScreen onBack={goBack} onNavigateToAnime={() => goBack()} />;
      case 'Settings':
        return <SettingsScreen onBack={goBack} onServerUrlChange={loadData} />;
      case 'Offline':
        return (
          <OfflineScreen
            onBack={goBack}
            onGoToDownloads={() => replace('Downloads')}
            onRetry={goBack}
          />
        );
      case 'MainTabs':
      default:
        switch (activeTab) {
          case 'Animes':
            return (
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
            );
          case 'Episodes':
            return (
              <EpisodesScreen
                episodes={episodes}
                loading={loading}
                onSelectEpisode={handleEpisodePress}
                onBack={() => setActiveTab('Home')}
              />
            );
          case 'Profile':
            return (
              <ProfileScreen
                onServerUrlChange={loadData}
                onOpenLogin={() => navigate('Login')}
                onOpenRegister={() => navigate('Register')}
                onOpenVip={() => navigate('Vip')}
                onOpenSettings={() => navigate('Settings')}
              />
            );
          case 'Home':
          default:
            return (
              <HomeScreen
                data={homeData}
                loading={loading}
                onRefresh={loadData}
                onEpisodePress={handleEpisodePress}
                onAnimePress={handleAnimePress}
                onViewAllEpisodes={() => setActiveTab('Episodes')}
                onViewAllAnimes={() => {
                  setSelectedAnime(null);
                  setActiveTab('Animes');
                }}
                characters={characters.length > 0 ? characters : undefined}
              />
            );
        }
    }
  };

  return (
    <NavigationContext.Provider value={navObj}>
      <View style={styles.container}>
        <View style={styles.content}>{renderCurrentScreen()}</View>

        {currentScreen === 'MainTabs' && (
          <CustomBottomTabBar
            activeTab={activeTab}
            onTabPress={(tab) => setActiveTab(tab as any)}
          />
        )}
      </View>
    </NavigationContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    flex: 1,
  },
});
