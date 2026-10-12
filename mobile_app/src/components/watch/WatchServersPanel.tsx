import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './watch.styles';

interface ServerOption {
  id: string;
  name: string;
  desc: string;
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
  return (
    <View style={styles.serversPanel}>
      <View style={styles.serversPanelHeader}>
        <View style={styles.serversTitleRow}>
          <Icon name="dns" size={18} color={THEME.colors.primaryContainer} />
          <Text style={styles.serversTitle}>اختر سيرفر البث المباشر</Text>
        </View>
        <TouchableOpacity
          style={styles.reportRow}
          onPress={() =>
            Alert.alert('تم استلام البلاغ', 'شكراً لمساعدتنا، سيتم فحص السيرفر فوراً!')
          }
        >
          <Icon name="flag" size={14} color={THEME.colors.onSurfaceVariant} />
          <Text style={styles.reportText}>إبلاغ عن رابط معطل</Text>
        </TouchableOpacity>
      </View>

      {/* Server Pills */}
      <View style={styles.serverPillsRow}>
        {servers.map((s) => {
          const isSelected = selectedServer === s.id;
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
                {s.desc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

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
