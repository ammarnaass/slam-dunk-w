import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import { THEME } from '../../../constants/theme';
import { Icon } from '../../../components/Icon';
import { ServerOption, AudioTrackType, ServerCategoryTab } from '../types/watch.types';
import { WatchServerTabs } from './WatchServerTabs';
import { WatchServerCard } from './WatchServerCard';
import { WatchAudioSelector } from './WatchAudioSelector';
import { serversStyles } from '../styles/servers.styles';

interface WatchServersPanelProps {
  servers: ServerOption[];
  selectedServer: string;
  onSelectServer: (id: string) => void;
  audioTrack: AudioTrackType;
  onChangeAudioTrack: (track: AudioTrackType) => void;
}

export const WatchServersPanel: React.FC<WatchServersPanelProps> = ({
  servers,
  selectedServer,
  onSelectServer,
  audioTrack,
  onChangeAudioTrack,
}) => {
  const [activeTab, setActiveTab] = useState<ServerCategoryTab>('direct');

  const directServers = useMemo(() => {
    return servers.filter(
      (s) =>
        s.matrixCategory === 'direct' ||
        ['hls', 'dropbox', 'mega', 'gdrive', '4shared'].includes(s.provider || '') ||
        !s.category ||
        s.category === 'streaming' ||
        s.category === 'both'
    );
  }, [servers]);

  const embedServers = useMemo(() => {
    return servers.filter(
      (s) =>
        s.matrixCategory === 'embed' ||
        ['vidmoly', 'okru', 'streamtape', 'mp4upload'].includes(s.provider || '')
    );
  }, [servers]);

  const downloadServers = useMemo(() => {
    const list = servers.filter(
      (s) => s.category === 'download' || s.category === 'both' || s.provider === 'mediafire'
    );
    return list.length > 0 ? list : servers;
  }, [servers]);

  const currentList =
    activeTab === 'embed'
      ? embedServers.length > 0
        ? embedServers
        : servers
      : activeTab === 'download'
      ? downloadServers
      : directServers;

  const handleDownload = (srv: ServerOption) => {
    const targetUrl = srv.downloadUrl || srv.directUrl || srv.url;
    if (!targetUrl) {
      Alert.alert('تنبيه', 'رابط التحميل غير متوفر لهذا السيرفر حالياً.');
      return;
    }
    Linking.openURL(targetUrl).catch(() => {
      Alert.alert('تنبيه', 'تعذر فتح رابط التحميل في المتصفح.');
    });
  };

  return (
    <View style={serversStyles.serversPanel}>
      <View style={serversStyles.serversPanelHeader}>
        <View style={serversStyles.serversTitleRow}>
          <Icon name="dns" size={18} color={THEME.colors.primaryContainer} />
          <Text style={serversStyles.serversTitle}>مصفوفة سيرفرات البث والتحميل</Text>
        </View>
        <TouchableOpacity
          style={serversStyles.reportRow}
          onPress={() =>
            Alert.alert('تم استلام البلاغ', 'شكراً لمساعدتنا، سيتم فحص واستبدال السيرفر فوراً!')
          }
        >
          <Icon name="flag" size={14} color={THEME.colors.onSurfaceVariant} />
          <Text style={serversStyles.reportText}>إبلاغ عن عطل</Text>
        </TouchableOpacity>
      </View>

      <WatchServerTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {activeTab === 'download' ? (
        <View style={{ gap: 8 }}>
          {downloadServers.map((srv) => (
            <TouchableOpacity
              key={srv.id}
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 12,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 8,
              }}
              onPress={() => handleDownload(srv)}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{srv.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="download" size={16} color={THEME.colors.primaryContainer} />
                <Text style={{ color: THEME.colors.primaryContainer, fontSize: 12 }}>تحميل الحلقة</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={serversStyles.serverPillsRow}>
          {currentList.map((srv) => (
            <WatchServerCard
              key={srv.id}
              server={srv}
              isSelected={selectedServer === srv.id}
              onSelect={onSelectServer}
            />
          ))}
        </ScrollView>
      )}

      <WatchAudioSelector audioTrack={audioTrack} onChangeAudioTrack={onChangeAudioTrack} />
    </View>
  );
};
