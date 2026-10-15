import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Alert,
  LogBox,
} from 'react-native';

if (__DEV__) {
  // Suppress dev warning overlays to keep screen clean on emulator
  LogBox.ignoreAllLogs(true);
}

import { Header } from './src/components/Header';
import { WatchModal } from './src/screens/WatchModal';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { useAppStore } from './src/store/useAppStore';
import { AppNavigator } from './src/navigation/AppNavigator';
import { MaintenanceModal, ForceUpdateModal } from './src/components/modals';
import { styles } from './src/app.styles';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

function MainApp(): React.JSX.Element {
  const {
    appConfig,
    selectedEpisode,
    selectedAnime,
    watchModalVisible,
    devBypassCode,
    isBypassed,
    setDevBypassCode,
    setIsBypassed,
    setWatchModalVisible,
    loadData,
    handleNextEpisode,
    handleHeaderSearch,
  } = useAppStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isMaintenanceActive = appConfig?.maintenance?.is_active && !isBypassed;
  const isForceUpdateActive = appConfig?.version_control?.force_update;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Main App Header */}
      <Header
        title={selectedAnime ? selectedAnime.title : 'ANIME DAZE'}
        onSearchPress={handleHeaderSearch}
        showSearch={true}
        onVipPress={() => {}}
        onNotificationPress={() => {
          Alert.alert('الإشعارات', 'لا توجد إشعارات جديدة حالياً، أنت مطلع على أحدث الحلقات!');
        }}
      />

      {/* React Navigation Root Navigator */}
      <View style={styles.screenContainer}>
        <AppNavigator />
      </View>

      {/* Episode Player & Servers Modal */}
      <WatchModal
        visible={watchModalVisible}
        episode={selectedEpisode}
        onClose={() => setWatchModalVisible(false)}
        onNextEpisode={handleNextEpisode}
      />

      {/* MAINTENANCE OVERLAY MODAL */}
      <MaintenanceModal
        visible={!!isMaintenanceActive}
        appConfig={appConfig}
        devBypassCode={devBypassCode}
        setDevBypassCode={setDevBypassCode}
        onBypassSuccess={() => setIsBypassed(true)}
      />

      {/* FORCE UPDATE MODAL */}
      <ForceUpdateModal
        visible={!!isForceUpdateActive}
        appConfig={appConfig}
      />
    </SafeAreaView>
  );
}

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ErrorBoundary>
        <MainApp />
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
