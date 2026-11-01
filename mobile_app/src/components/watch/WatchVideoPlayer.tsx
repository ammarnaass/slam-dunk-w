import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './watch.styles';

export function getEmbedUrl(rawUrl?: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (trimmed.includes('mega.nz/file/')) {
    const match = trimmed.match(/mega\.nz\/file\/([^#]+)#(.+)/);
    if (match) return `https://mega.nz/embed/${match[1]}!${match[2]}`;
  }
  if (trimmed.includes('mega.nz/embed/')) {
    return trimmed;
  }
  if (trimmed.includes('4shared.com')) {
    const match = trimmed.match(/4shared\.com\/(?:video|file|rar|zip|mp3)\/([^/]+)/);
    if (match) return `https://www.4shared.com/web/embed/file/${match[1]}`;
  }
  if (trimmed.includes('drive.google.com')) {
    return trimmed.replace('/view', '/preview');
  }
  return trimmed;
}

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

interface WatchVideoPlayerProps {
  thumbnailUrl?: string;
  videoUrl?: string;
  serverName?: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  positionSeconds?: number;
  totalDurationSeconds?: number;
  onAutoFailover?: () => void;
}

export const WatchVideoPlayer: React.FC<WatchVideoPlayerProps> = ({
  thumbnailUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMPVNR4ix76vzObnfVl-_p9CUq0Lh9p40E21mNoEN8WXID79OT4iIDMlpJq-OwOOshargraXFmTOJ5GDo0DinsBgvSWKsos0klNKgwvyCVkVyQ5MmQzQPlhTy8X6x74nNjEl80PxCHj7zRirprKdR3QtSaRaNEXQHNtoGRAtEv1eiiA5YjiQ4OqN_XIIKPua84NEE0peAb1K3swIuKif5EqdRHWEiAAkUkUhZuYxvXX7LBRKSvJ4iH',
  videoUrl,
  serverName = 'سيرفر ميجا السريع',
  isPlaying,
  onTogglePlay,
  positionSeconds = 0,
  totalDurationSeconds = 1440,
  onAutoFailover,
}) => {
  const [webViewLoading, setWebViewLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const embedUrl = useMemo(() => getEmbedUrl(videoUrl), [videoUrl]);

  const handleOpenExternal = () => {
    if (!videoUrl) return;
    Alert.alert(
      '🎬 تشغيل الحلقة',
      `سيرفر: ${serverName}\nالجودة: 1080p FHD\n\nاختر طريقة المشاهدة المفضلة:`,
      [
        {
          text: '🚀 فتح في تطبيق MEGA / المتصفح',
          onPress: async () => {
            try {
              await Linking.openURL(videoUrl);
            } catch (_) {
              try {
                await Linking.openURL(embedUrl || videoUrl);
              } catch {
                Alert.alert('تنبيه', 'لم يتم العثور على متصفح أو تطبيق متوافق على هذا الجهاز.');
              }
            }
          },
        },
        {
          text: '📋 نسخ / مشاركة الرابط',
          onPress: () => {
            Share.share({
              title: 'رابط مشاهدة الحلقة',
              message: videoUrl,
              url: videoUrl,
            });
          },
        },
        { text: 'إلغاء', style: 'cancel' },
      ]
    );
  };

  const progressPercent = totalDurationSeconds > 0
    ? `${Math.min(100, Math.max(0, (positionSeconds / totalDurationSeconds) * 100))}%`
    : '0%';

  return (
    <View style={styles.playerFrame}>
      {/* 1. Real Streaming WebView when playing */}
      {isPlaying && embedUrl && !hasError ? (
        <View style={StyleSheet.absoluteFill}>
          <WebView
            key={embedUrl}
            source={{ uri: embedUrl }}
            style={styles.playerPoster}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsFullscreenVideo={true}
            mediaPlaybackRequiresUserAction={false}
            allowsInlineMediaPlayback={true}
            originWhitelist={['*']}
            userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
            onLoadStart={() => setWebViewLoading(true)}
            onLoadEnd={() => setWebViewLoading(false)}
            onError={() => {
              setWebViewLoading(false);
              setHasError(true);
              if (onAutoFailover) {
                setTimeout(onAutoFailover, 600);
              }
            }}
          />

          {webViewLoading && (
            <View style={localStyles.loadingOverlay}>
              <ActivityIndicator size="large" color={THEME.colors.primaryContainer} />
              <Text style={localStyles.loadingText}>جاري تجهيز سيرفر البث المباشر...</Text>
            </View>
          )}

          {/* Quick Floating Overlay: Open in External/Mega app or Browser */}
          <TouchableOpacity
            style={localStyles.externalFloatingBtn}
            onPress={handleOpenExternal}
            activeOpacity={0.85}
          >
            <Icon name="rocket_launch" size={14} color="#FFFFFF" />
            <Text style={localStyles.externalFloatingText}>مشغل خارجي</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* 2. Poster Backdrop when paused */
        <>
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.playerPoster}
            resizeMode="cover"
          />
          {/* Scrim Gradient */}
          <View style={styles.playerScrim} />

          {/* Top Live Badges */}
          <View style={styles.playerTopBar}>
            <View style={styles.liveIndicatorRow}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>بث فائق الدقة</Text>
              </View>
              <View style={styles.qualityTag}>
                <Text style={styles.qualityTagText}>1080p FHD</Text>
              </View>
            </View>

            <TouchableOpacity
              style={localStyles.externalHeaderBtn}
              onPress={handleOpenExternal}
              activeOpacity={0.8}
            >
              <Icon name="rocket_launch" size={16} color={THEME.colors.onSurface} />
              <Text style={localStyles.externalHeaderText}>فتح بالمتصفح</Text>
            </TouchableOpacity>
          </View>

          {/* Center Play Button with direct stream launcher */}
          <TouchableOpacity
            style={styles.centerPlayBtn}
            onPress={handleOpenExternal}
            activeOpacity={0.88}
          >
            <Icon
              name="play_arrow"
              size={36}
              color={THEME.colors.onPrimaryContainer}
              filled
            />
          </TouchableOpacity>

          {/* Bottom Controls Bar */}
          <View style={styles.playerBottomControls}>
            <View style={styles.playerProgressBar}>
              <View style={[styles.playerProgressFill, { width: progressPercent as any }]} />
            </View>

            <View style={styles.controlsRow}>
              <View style={styles.controlsLeft}>
                <TouchableOpacity onPress={handleOpenExternal}>
                  <Icon
                    name="play_arrow"
                    size={20}
                    color={THEME.colors.onSurface}
                    filled
                  />
                </TouchableOpacity>

                <Text style={styles.timerText}>
                  {formatTime(positionSeconds)}{' '}
                  <Text style={styles.timerSlash}>/</Text>{' '}
                  {formatTime(totalDurationSeconds)}
                </Text>
              </View>

              <View style={styles.controlsRight}>
                <Text style={localStyles.serverLabel} numberOfLines={1}>
                  {serverName}
                </Text>
                <TouchableOpacity onPress={handleOpenExternal}>
                  <Icon name="fullscreen" size={20} color={THEME.colors.onSurface} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFill as object,
    backgroundColor: 'rgba(10, 14, 22, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    gap: 12,
  },
  loadingText: {
    color: THEME.colors.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  externalFloatingBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(20, 26, 38, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 20,
  },
  externalFloatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  externalHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  externalHeaderText: {
    color: THEME.colors.onSurface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  serverLabel: {
    color: THEME.colors.onSurfaceVariant,
    fontSize: 11,
    maxWidth: 140,
  },
});
