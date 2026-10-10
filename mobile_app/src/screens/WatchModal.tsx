import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Episode } from '../types';
import { THEME } from '../constants/theme';

interface WatchModalProps {
  visible: boolean;
  episode: Episode | null;
  onClose: () => void;
}

export const WatchModal: React.FC<WatchModalProps> = ({ visible, episode, onClose }) => {
  const [selectedServer, setSelectedServer] = useState<string>('mega');

  if (!episode) return null;

  const epNum =
    episode.episode_number ||
    episode.episodeNumber ||
    (episode.title.match(/\d+/) ? episode.title.match(/\d+/)![0] : '1');

  let imageUri = episode.thumbnail;
  if (!imageUri || imageUri === '/logoep.jpg') {
    imageUri =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTxpjOV_-f3YQQLUb_T_57HXpyZ4NIlMatMg&s';
  }

  const handleOpenStream = (url?: string) => {
    const targetUrl = url || episode.mega_link;
    if (!targetUrl) {
      Alert.alert('مشاهدة الحلقة', 'سيتم تشغيل البث المباشر للحلقة الآن!');
      return;
    }
    Linking.openURL(targetUrl).catch(() => {
      Alert.alert('خطأ', 'تعذر فتح الرابط');
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕ إغلاق</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>الحلقة {epNum}</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Video Player Box */}
          <View style={styles.playerBox}>
            <Image source={{ uri: imageUri }} style={styles.playerImage} resizeMode="cover" />
            <View style={styles.playerOverlay}>
              <TouchableOpacity
                style={styles.bigPlayButton}
                onPress={() => handleOpenStream(episode.mega_link)}
                activeOpacity={0.8}
              >
                <Text style={styles.bigPlayIcon}>▶</Text>
              </TouchableOpacity>
              <Text style={styles.playerNotice}>اضغط لبدء التشغيل الفوري</Text>
            </View>
          </View>

          {/* Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>الحلقة {epNum}</Text>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>⏱ {episode.duration || '23:30'}</Text>
              </View>
              <View style={styles.qualityBadge}>
                <Text style={styles.qualityText}>FHD 1080p</Text>
              </View>
            </View>

            <Text style={styles.title}>{episode.title}</Text>
            <Text style={styles.animeName}>{episode.animeTitle || 'سلام دانك - Slam Dunk'}</Text>

            <Text style={styles.description}>
              {episode.description ||
                `الحلقة ${epNum} من أنمي سلام دانك الأسطوري. تابع مغامرات ساكوراجي وفريق شوهوكو نحو حلم البطولة الوطنية لكرة السلة.`}
            </Text>

            {/* Servers Section */}
            <View style={styles.serversSection}>
              <Text style={styles.serversTitle}>سيرفرات المشاهدة والتحميل:</Text>

              <TouchableOpacity
                style={[styles.serverItem, selectedServer === 'mega' && styles.serverItemActive]}
                onPress={() => {
                  setSelectedServer('mega');
                  handleOpenStream(episode.mega_link);
                }}
              >
                <View style={styles.serverIcon}>
                  <Text style={styles.serverIconText}>🚀</Text>
                </View>
                <View style={styles.serverMeta}>
                  <Text style={styles.serverName}>Mega.nz Server (سريع وبدون إعلانات)</Text>
                  <Text style={styles.serverQuality}>جودة 1080p - متعدد الجودات</Text>
                </View>
                <Text style={styles.playArrow}>◀</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.serverItem, selectedServer === 'direct' && styles.serverItemActive]}
                onPress={() => {
                  setSelectedServer('direct');
                  handleOpenStream();
                }}
              >
                <View style={styles.serverIcon}>
                  <Text style={styles.serverIconText}>⚡</Text>
                </View>
                <View style={styles.serverMeta}>
                  <Text style={styles.serverName}>سيرفر المشاهدة المباشر 1</Text>
                  <Text style={styles.serverQuality}>سيرفر احتياطي عالي السرعة</Text>
                </View>
                <Text style={styles.playArrow}>◀</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.cardBorder,
  },
  topBarTitle: {
    color: THEME.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.sm,
  },
  closeBtnText: {
    color: THEME.colors.primaryLight,
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  playerBox: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: THEME.colors.surface,
    position: 'relative',
  },
  playerImage: {
    width: '100%',
    height: '100%',
  },
  playerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigPlayButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
    shadowColor: THEME.colors.primary,
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  bigPlayIcon: {
    color: THEME.colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  playerNotice: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    marginTop: 8,
  },
  detailsContainer: {
    padding: THEME.spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row-reverse',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.sm,
  },
  badge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
  },
  badgeText: {
    color: THEME.colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  durationBadge: {
    backgroundColor: THEME.colors.card,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
  },
  durationText: {
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  qualityBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
  },
  qualityText: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontWeight: 'bold',
  },
  title: {
    color: THEME.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  animeName: {
    color: THEME.colors.textDim,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'right',
  },
  description: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: THEME.spacing.md,
    textAlign: 'right',
  },
  serversSection: {
    marginTop: THEME.spacing.xl,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  serversTitle: {
    color: THEME.colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: THEME.spacing.md,
  },
  serverItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    marginBottom: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  serverItemActive: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
  serverIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: THEME.spacing.sm,
  },
  serverIconText: {
    fontSize: 16,
  },
  serverMeta: {
    flex: 1,
  },
  serverName: {
    color: THEME.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  serverQuality: {
    color: THEME.colors.textDim,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'right',
  },
  playArrow: {
    color: THEME.colors.primaryLight,
    fontSize: 12,
  },
});
