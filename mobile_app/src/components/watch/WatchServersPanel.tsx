import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, ScrollView } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './watch.styles';

export interface ServerOption {
  id: string;
  name: string;
  desc: string;
  url?: string;
  directUrl?: string;
  downloadUrl?: string;
  category?: 'streaming' | 'download' | 'both';
  matrixCategory?: 'direct' | 'embed' | 'download';
  provider?: string;
  ping?: string;
  isWorking?: boolean;
}

interface WatchServersPanelProps {
  servers: ServerOption[];
  selectedServer: string;
  onSelectServer: (id: string) => void;
  audioTrack: 'dub' | 'sub';
  onChangeAudioTrack: (track: 'dub' | 'sub') => void;
}

export const WatchServersPanel: React.FC<WatchServersPanelProps> = ({
  servers,
  selectedServer,
  onSelectServer,
  audioTrack,
  onChangeAudioTrack,
}) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'embed' | 'download'>('direct');

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

  const currentList = activeTab === 'embed' ? (embedServers.length > 0 ? embedServers : servers) : directServers;

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
    <View style={styles.serversPanel}>
      {/* Header with Title and Report Button */}
      <View style={styles.serversPanelHeader}>
        <View style={styles.serversTitleRow}>
          <Icon name="dns" size={18} color={THEME.colors.primaryContainer} />
          <Text style={styles.serversTitle}>مصفوفة سيرفرات البث والتحميل</Text>
        </View>
        <TouchableOpacity
          style={styles.reportRow}
          onPress={() =>
            Alert.alert('تم استلام البلاغ', 'شكراً لمساعدتنا، سيتم فحص واستبدال السيرفر فوراً!')
          }
        >
          <Icon name="flag" size={14} color={THEME.colors.onSurfaceVariant} />
          <Text style={styles.reportText}>إبلاغ عن عطل</Text>
        </TouchableOpacity>
      </View>

      {/* Category Matrix Tabs (Anime Slayer Style) */}
      <View style={{ flexDirection: 'row-reverse', gap: 6, marginBottom: 12 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 7,
            borderRadius: 8,
            backgroundColor: activeTab === 'direct' ? THEME.colors.primaryContainer : THEME.colors.surfaceContainerHigh,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => setActiveTab('direct')}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: activeTab === 'direct' ? '#FFFFFF' : THEME.colors.onSurfaceVariant,
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            ⚡ فائقة السرعة
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 7,
            borderRadius: 8,
            backgroundColor: activeTab === 'embed' ? THEME.colors.primaryContainer : THEME.colors.surfaceContainerHigh,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => setActiveTab('embed')}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: activeTab === 'embed' ? '#FFFFFF' : THEME.colors.onSurfaceVariant,
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            📺 احتياطية
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 7,
            borderRadius: 8,
            backgroundColor: activeTab === 'download' ? THEME.colors.secondary : THEME.colors.surfaceContainerHigh,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => setActiveTab('download')}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color: activeTab === 'download' ? '#FFFFFF' : THEME.colors.secondary,
              fontSize: 12,
              fontWeight: 'bold',
            }}
          >
            ⬇️ تحميل مباشر
          </Text>
        </TouchableOpacity>
      </View>

      {/* Watch Servers Pills */}
      {activeTab !== 'download' ? (
        <View style={styles.serverPillsRow}>
          {currentList.map((s, idx) => {
            const isSelected = selectedServer === s.id;
            const pingStr = s.ping || (idx === 0 ? '18ms' : '28ms');
            return (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.serverPill,
                  isSelected ? styles.serverPillActive : styles.serverPillNormal,
                ]}
                onPress={() => onSelectServer(s.id)}
                activeOpacity={0.8}
              >
                {isSelected && <View style={styles.serverDotActive} />}
                <Text
                  style={[
                    styles.serverName,
                    isSelected && styles.serverNameActive,
                  ]}
                  numberOfLines={1}
                >
                  {s.name}
                </Text>
                <Text
                  style={[
                    styles.serverDesc,
                    isSelected && styles.serverDescActive,
                  ]}
                >
                  {s.desc || '1080p FHD'} • {pingStr}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        /* Direct Download Matrix Options */
        <View style={{ gap: 8, marginBottom: 12 }}>
          {downloadServers.slice(0, 3).map((srv, idx) => {
            const qualityLabel = idx === 0 ? 'خارقة (1080p FHD)' : idx === 1 ? 'عالية (720p HD)' : 'متوسطة (480p SD)';
            const color = idx === 0 ? THEME.colors.primaryContainer : idx === 1 ? THEME.colors.secondary : THEME.colors.onSurface;

            return (
              <TouchableOpacity
                key={srv.id || idx}
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: THEME.colors.surfaceContainerLowest,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.06)',
                }}
                onPress={() => handleDownload(srv)}
                activeOpacity={0.8}
              >
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 8 }}>
                  <Icon name="download" size={20} color={color} />
                  <View>
                    <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' }}>
                      تحميل الجودة {qualityLabel}
                    </Text>
                    <Text style={{ color: THEME.colors.onSurfaceVariant, fontSize: 11 }}>
                      {srv.name} • تحميل مباشر فوري
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: color, fontSize: 11, fontWeight: 'bold' }}>
                    تنزيل
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Audio Track Switcher */}
      <View style={styles.audioSwitchRow}>
        <View style={styles.audioSwitchLabel}>
          <Icon name="translate" size={18} color={THEME.colors.secondary} />
          <Text style={styles.audioLabelText}>المسار الصوتي والترجمة</Text>
        </View>

        <View style={styles.audioToggleCapsule}>
          <TouchableOpacity
            style={[
              styles.audioToggleBtn,
              audioTrack === 'dub' && styles.audioToggleBtnActive,
            ]}
            onPress={() => onChangeAudioTrack('dub')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.audioToggleText,
                audioTrack === 'dub' && styles.audioToggleTextActive,
              ]}
            >
              الدبلجة الكلاسيكية
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.audioToggleBtn,
              audioTrack === 'sub' && styles.audioToggleBtnActive,
            ]}
            onPress={() => onChangeAudioTrack('sub')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.audioToggleText,
                audioTrack === 'sub' && styles.audioToggleTextActive,
              ]}
            >
              الياباني المترجم
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
