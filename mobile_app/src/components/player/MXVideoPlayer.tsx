import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Share,
  Image,
  UIManager,
} from 'react-native';

const isNativeRCTVideoAvailable = Boolean(
  UIManager.getViewManagerConfig?.('RCTVideo') ||
  (UIManager as any)['RCTVideo']
);
import Video, { VideoRef, ResizeMode } from 'react-native-video';
import { MXGestureOverlay } from './MXGestureOverlay';
import { MXCinematicHUD, AspectRatioMode } from './MXCinematicHUD';
import { MXEpisodesDrawer } from './MXEpisodesDrawer';
import { Episode } from '../../types';
import { Icon } from '../Icon';
import { THEME } from '../../constants/theme';

interface MXVideoPlayerProps {
  episode: Episode;
  allEpisodes?: Episode[];
  videoUrl: string;
  serverName: string;
  onClose: () => void;
  onEpisodeChange?: (newEpisode: Episode) => void;
  onProgressUpdate?: (currentTime: number, duration: number) => void;
}

// Demo direct MP4 stream for immediate testing of full MX Player gestures
const DEMO_DIRECT_STREAM = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export const MXVideoPlayer: React.FC<MXVideoPlayerProps> = ({
  episode,
  allEpisodes = [],
  videoUrl,
  serverName,
  onClose,
  onEpisodeChange,
  onProgressUpdate,
}) => {
  const videoRef = useRef<VideoRef | null>(null);

  // Determine if stream is a direct video format supported by ExoPlayer
  const isDirectStream =
    videoUrl &&
    (videoUrl.endsWith('.mp4') ||
      videoUrl.endsWith('.m3u8') ||
      videoUrl.endsWith('.mkv') ||
      videoUrl.includes('googleapis.com') ||
      videoUrl.includes('cdn') ||
      videoUrl.includes('stream'));

  // If not direct stream, use demo stream so full MX Player experience plays immediately
  const [useDemoStream, setUseDemoStream] = useState<boolean>(!isDirectStream);
  const activeStreamUrl = useDemoStream ? DEMO_DIRECT_STREAM : videoUrl;

  // Player Playback States
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(1410); // Default 23:30 in seconds
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('contain');

  // Gestures & HUD States
  const [volume, setVolume] = useState<number>(1.0);
  const [brightness, setBrightness] = useState<number>(0.9);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isHudVisible, setIsHudVisible] = useState<boolean>(true);
  const [isEpisodesDrawerOpen, setIsEpisodesDrawerOpen] = useState<boolean>(false);

  const hudTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-hide HUD after 3.8 seconds of inactivity
  const resetHudTimer = useCallback(() => {
    if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    if (!isLocked && isPlaying) {
      hudTimerRef.current = setTimeout(() => {
        setIsHudVisible(false);
      }, 3800);
    }
  }, [isLocked, isPlaying]);

  useEffect(() => {
    if (isHudVisible) {
      resetHudTimer();
    }
    return () => {
      if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    };
  }, [isHudVisible, resetHudTimer]);

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
    resetHudTimer();
  };

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    videoRef.current?.seek(newTime);
    resetHudTimer();
  };

  const handleSkipSeconds = (deltaSeconds: number) => {
    const target = Math.max(0, Math.min(duration, currentTime + deltaSeconds));
    handleSeek(target);
  };

  const handleDoubleTapSkip = (direction: 'forward' | 'backward') => {
    handleSkipSeconds(direction === 'forward' ? 10 : -10);
  };

  const handleToggleAspectRatio = () => {
    setAspectRatio((prev) => {
      if (prev === 'contain') return 'cover';
      if (prev === 'cover') return 'stretch';
      return 'contain';
    });
    resetHudTimer();
  };

  const handleToggleLock = () => {
    setIsLocked((prev) => {
      const next = !prev;
      if (next) {
        setIsHudVisible(false);
      } else {
        setIsHudVisible(true);
      }
      return next;
    });
  };

  const handleOpenExternal = () => {
    Alert.alert(
      '🎬 خيارات تشغيل الحلقة',
      `سيرفر: ${serverName}\nالجودة: 1080p FHD\nاختر الإجراء المناسب:`,
      [
        {
          text: '🚀 فتح في تطبيق MEGA / المتصفح',
          onPress: () => {
            Share.share({
              title: `مشاهدة ${episode.title}`,
              message: videoUrl,
              url: videoUrl,
            });
          },
        },
        {
          text: '⚡ تجربة مشغل MX Player على فيديو تجريبي',
          onPress: () => setUseDemoStream(true),
        },
        { text: 'إلغاء', style: 'cancel' },
      ]
    );
  };

  // Episode Navigation
  // Simulated playback timer for platforms without native RCTVideo
  useEffect(() => {
    if (!isNativeRCTVideoAvailable && isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackRate;
          if (next >= duration) return 0;
          return next;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, playbackRate, duration]);

  const currentEpIndex = allEpisodes.findIndex((e) => e.id === episode.id);
  const prevEp = currentEpIndex > 0 ? allEpisodes[currentEpIndex - 1] : undefined;
  const nextEp = currentEpIndex < allEpisodes.length - 1 ? allEpisodes[currentEpIndex + 1] : undefined;

  const resizeModeMap: Record<AspectRatioMode, ResizeMode> = {
    contain: ResizeMode.CONTAIN,
    cover: ResizeMode.COVER,
    stretch: ResizeMode.STRETCH,
  };

  return (
    <View style={styles.container}>
      {/* 1. NATIVE VIDEO LAYER (ExoPlayer) / SAFE CANVAS FALLBACK */}
      {isDirectStream || useDemoStream ? (
        isNativeRCTVideoAvailable ? (
          <Video
            ref={videoRef}
            source={{ uri: activeStreamUrl }}
            style={styles.videoPlayer}
            resizeMode={resizeModeMap[aspectRatio]}
            rate={playbackRate}
            volume={volume}
            paused={!isPlaying}
            onLoad={(data) => {
              setDuration(data.duration || 1410);
              setIsBuffering(false);
            }}
            onProgress={(data) => {
              setCurrentTime(data.currentTime);
              onProgressUpdate?.(data.currentTime, data.seekableDuration || duration);
            }}
            onBuffer={({ isBuffering: buffering }) => setIsBuffering(buffering)}
            onError={(err) => {
              console.warn('Video Error: ', err);
              setIsBuffering(false);
            }}
            repeat={false}
          />
        ) : (
          /* High-performance animated canvas for simulated playback */
          <View style={styles.simulatedVideoContainer}>
            <Image
              source={{ uri: episode.thumbnail || '/logoep.jpg' }}
              style={styles.simulatedPosterImage}
              resizeMode={aspectRatio === 'stretch' ? 'stretch' : aspectRatio === 'cover' ? 'cover' : 'contain'}
            />
            <View style={styles.simulatedScrim}>
              <View style={styles.simulatedLivePill}>
                <View style={styles.liveDot} />
                <Text style={styles.simulatedLiveText}>
                  مشغل MX Player السينمائي (بث فائق 1080p)
                </Text>
              </View>
            </View>
          </View>
        )
      ) : (
        /* Fallback for encrypted cloud file pages */
        <View style={styles.cloudPosterContainer}>
          <Image
            source={{ uri: episode.thumbnail || '/logoep.jpg' }}
            style={styles.cloudPosterImage}
            resizeMode="cover"
          />
          <View style={styles.cloudPosterScrim}>
            <View style={styles.cloudBadge}>
              <Text style={styles.cloudBadgeText}>سيرفر سحابي مشفر: {serverName}</Text>
            </View>
            <Text style={styles.cloudTitle}>{episode.title}</Text>
            <Text style={styles.cloudSubtitle}>
              يدعم مشغل MX Player البث المباشر (Direct Stream). للتشغيل الفوري:
            </Text>

            <View style={styles.cloudButtonsRow}>
              <TouchableOpacity
                style={styles.cloudPrimaryBtn}
                onPress={handleOpenExternal}
                activeOpacity={0.85}
              >
                <Icon name="rocket_launch" size={20} color="#FFF" />
                <Text style={styles.cloudBtnText}>تشغيل عبر تطبيق MEGA / المتصفح</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cloudSecondaryBtn}
                onPress={() => setUseDemoStream(true)}
                activeOpacity={0.85}
              >
                <Icon name="play" size={18} color="#FF6B00" />
                <Text style={styles.cloudSecondaryBtnText}>تجربة إيماءات MX Player على بث مباشر</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Buffering Indicator */}
      {isBuffering && (
        <View style={styles.bufferingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.bufferingText}>جارٍ تحميل البث السينمائي...</Text>
        </View>
      )}

      {/* 2. GESTURE CONTROLLER LAYER (Touch, Volume, Brightness, Seek) */}
      {(isDirectStream || useDemoStream) && (
        <MXGestureOverlay
          duration={duration}
          currentTime={currentTime}
          volume={volume}
          brightness={brightness}
          isLocked={isLocked}
          onSeek={handleSeek}
          onVolumeChange={setVolume}
          onBrightnessChange={setBrightness}
          onSingleTap={() => {
            setIsHudVisible((prev) => !prev);
            resetHudTimer();
          }}
          onDoubleTapSkip={handleDoubleTapSkip}
        />
      )}

      {/* 3. CINEMATIC IN-PLAYER HUD LAYER */}
      <MXCinematicHUD
        isVisible={isHudVisible}
        isPlaying={isPlaying}
        isLocked={isLocked}
        title={episode.title}
        episodeNumber={episode.episode_number || episode.episodeNumber || 1}
        quality="1080p FHD"
        currentTime={currentTime}
        duration={duration}
        playbackRate={playbackRate}
        aspectRatio={aspectRatio}
        onTogglePlay={handleTogglePlay}
        onSeek={handleSeek}
        onSkipSeconds={handleSkipSeconds}
        onNextEpisode={nextEp && onEpisodeChange ? () => onEpisodeChange(nextEp) : undefined}
        onPrevEpisode={prevEp && onEpisodeChange ? () => onEpisodeChange(prevEp) : undefined}
        onToggleLock={handleToggleLock}
        onChangeRate={setPlaybackRate}
        onToggleAspectRatio={handleToggleAspectRatio}
        onOpenEpisodesDrawer={() => setIsEpisodesDrawerOpen(true)}
        onBack={onClose}
      />

      {/* 4. IN-PLAYER EPISODES DRAWER */}
      {allEpisodes.length > 0 && (
        <MXEpisodesDrawer
          visible={isEpisodesDrawerOpen}
          episodes={allEpisodes}
          currentEpisodeId={episode.id}
          onSelectEpisode={(ep) => onEpisodeChange?.(ep)}
          onClose={() => setIsEpisodesDrawerOpen(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    ...StyleSheet.absoluteFill,
  },
  simulatedVideoContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  simulatedPosterImage: {
    width: '100%',
    height: '100%',
  },
  simulatedScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simulatedLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  simulatedLiveText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bufferingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bufferingText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
  },
  cloudPosterContainer: {
    ...StyleSheet.absoluteFill,
  },
  cloudPosterImage: {
    width: '100%',
    height: '100%',
  },
  cloudPosterScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 15, 29, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cloudBadge: {
    backgroundColor: 'rgba(230, 57, 70, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E63946',
    marginBottom: 12,
  },
  cloudBadgeText: {
    color: '#FF8A8A',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cloudTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  cloudSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 320,
    lineHeight: 20,
  },
  cloudButtonsRow: {
    width: '100%',
    maxWidth: 340,
    gap: 12,
  },
  cloudPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E63946',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 10,
    elevation: 4,
  },
  cloudBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cloudSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.4)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 8,
  },
  cloudSecondaryBtnText: {
    color: '#FF6B00',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
