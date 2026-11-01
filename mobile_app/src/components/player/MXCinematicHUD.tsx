import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Icon } from '../Icon';
import { THEME } from '../../constants/theme';

export type AspectRatioMode = 'contain' | 'cover' | 'stretch';

interface MXCinematicHUDProps {
  isVisible: boolean;
  isPlaying: boolean;
  isLocked: boolean;
  title: string;
  episodeNumber: number;
  quality: string;
  currentTime: number;
  duration: number;
  playbackRate: number;
  aspectRatio: AspectRatioMode;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSkipSeconds: (seconds: number) => void;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  onToggleLock: () => void;
  onChangeRate: (rate: number) => void;
  onToggleAspectRatio: () => void;
  onOpenEpisodesDrawer: () => void;
  onBack: () => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export const MXCinematicHUD: React.FC<MXCinematicHUDProps> = ({
  isVisible,
  isPlaying,
  isLocked,
  title,
  episodeNumber,
  quality,
  currentTime,
  duration,
  playbackRate,
  aspectRatio,
  onTogglePlay,
  onSeek,
  onSkipSeconds,
  onNextEpisode,
  onPrevEpisode,
  onToggleLock,
  onChangeRate,
  onToggleAspectRatio,
  onOpenEpisodesDrawer,
  onBack,
}) => {
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [unlockPromptVisible, setUnlockPromptVisible] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.floor(Math.max(0, seconds) % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // When Locked: Only show the small lock icon floating on the top-left
  if (isLocked) {
    return (
      <View style={styles.lockedContainer} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.floatingLockBtn}
          onPress={() => {
            setUnlockPromptVisible(true);
            setTimeout(() => setUnlockPromptVisible(false), 2200);
          }}
          activeOpacity={0.8}
        >
          <Icon name="lock" size={24} color="#FF6B00" />
        </TouchableOpacity>

        {unlockPromptVisible && (
          <View style={styles.unlockPromptBox}>
            <Text style={styles.unlockPromptText}>الشاشة مقفلة 🔒</Text>
            <TouchableOpacity
              style={styles.unlockActionBtn}
              onPress={onToggleLock}
              activeOpacity={0.8}
            >
              <Text style={styles.unlockActionBtnText}>إلغاء القفل الآن 🔓</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  if (!isVisible) return null;

  return (
    <View style={styles.hudOverlay} pointerEvents="box-none">
      {/* TOP HEADER */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.headerBtn} onPress={onBack} activeOpacity={0.7}>
          <Icon name="arrowRight" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.titleInfo}>
          <Text style={styles.episodeTitle} numberOfLines={1}>
            الحلقة {episodeNumber}: {title}
          </Text>
          <View style={styles.badgeRow}>
            <View style={styles.qualityBadge}>
              <Text style={styles.qualityText}>{quality || '1080p FHD'}</Text>
            </View>
            <View style={styles.aspectBadge}>
              <Text style={styles.aspectText}>
                {aspectRatio === 'contain' ? '16:9 أصلي' : aspectRatio === 'cover' ? 'اقتصاص Zoom' : 'تمديد Stretch'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={onToggleAspectRatio}
            activeOpacity={0.7}
          >
            <Icon name="fullscreen" size={22} color="#E2E8F0" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerBtn, styles.lockBtn]}
            onPress={onToggleLock}
            activeOpacity={0.7}
          >
            <Icon name="lock_open" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTTOM CONTROLS */}
      <View style={styles.bottomBar}>
        {/* Scrubber Progress Bar */}
        <View style={styles.scrubberRow}>
          <Text style={styles.timeLabel}>{formatTime(currentTime)}</Text>
          <Pressable
            style={styles.scrubberTrack}
            onPress={(evt) => {
              const { locationX } = evt.nativeEvent;
              // Simple progress scrubber touch estimation
              const width = 220; // approximate width
              const ratio = Math.max(0, Math.min(1, locationX / width));
              onSeek(ratio * duration);
            }}
          >
            <View style={[styles.scrubberFill, { width: `${progressPercent}%` }]} />
            <View style={[styles.scrubberThumb, { left: `${progressPercent}%` }]} />
          </Pressable>
          <Text style={styles.timeLabel}>{formatTime(duration)}</Text>
        </View>

        {/* Action Controls Row */}
        <View style={styles.controlsRow}>
          {/* Quick Drawer for episodes */}
          <TouchableOpacity
            style={styles.iconControlBtn}
            onPress={onOpenEpisodesDrawer}
            activeOpacity={0.7}
          >
            <Icon name="view_agenda" size={22} color="#E2E8F0" />
            <Text style={styles.controlSubText}>الحلقات</Text>
          </TouchableOpacity>

          {/* Speed Selector */}
          <TouchableOpacity
            style={styles.iconControlBtn}
            onPress={() => setShowSpeedModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.speedLabel}>{playbackRate}x</Text>
            <Text style={styles.controlSubText}>السرعة</Text>
          </TouchableOpacity>

          {/* Prev Episode */}
          {onPrevEpisode && (
            <TouchableOpacity style={styles.iconControlBtn} onPress={onPrevEpisode} activeOpacity={0.7}>
              <Icon name="arrowRight" size={24} color="#FFF" />
            </TouchableOpacity>
          )}

          {/* Skip Back 10s */}
          <TouchableOpacity style={styles.iconControlBtn} onPress={() => onSkipSeconds(-10)} activeOpacity={0.7}>
            <Icon name="replay_10" size={24} color="#FFF" />
          </TouchableOpacity>

          {/* Play / Pause Main Button */}
          <TouchableOpacity
            style={styles.mainPlayBtn}
            onPress={onTogglePlay}
            activeOpacity={0.85}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} size={30} color="#FFF" />
          </TouchableOpacity>

          {/* Skip Forward 10s */}
          <TouchableOpacity style={styles.iconControlBtn} onPress={() => onSkipSeconds(10)} activeOpacity={0.7}>
            <Icon name="forward_10" size={24} color="#FFF" />
          </TouchableOpacity>

          {/* Next Episode */}
          {onNextEpisode && (
            <TouchableOpacity style={styles.iconControlBtn} onPress={onNextEpisode} activeOpacity={0.7}>
              <Icon name="arrowLeft" size={24} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Playback Speed Overlay */}
      {showSpeedModal && (
        <View style={styles.speedOverlayContainer}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowSpeedModal(false)}>
            <View style={styles.speedModalContent}>
              <Text style={styles.speedModalTitle}>سرعة التشغيل (Playback Speed)</Text>
              <FlatList
                data={SPEED_OPTIONS}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.speedOptionItem,
                      playbackRate === item && styles.speedOptionItemActive,
                    ]}
                    onPress={() => {
                      onChangeRate(item);
                      setShowSpeedModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.speedOptionText,
                        playbackRate === item && styles.speedOptionTextActive,
                      ]}
                    >
                      {item === 1.0 ? '1.0x (العادي)' : `${item}x`}
                    </Text>
                    {playbackRate === item && <Icon name="check" size={18} color="#FF6B00" />}
                  </TouchableOpacity>
                )}
              />
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  hudOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    zIndex: 999,
    elevation: 30,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 16,
    backgroundColor: 'rgba(10, 15, 29, 0.88)',
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBtn: {
    backgroundColor: 'rgba(230, 57, 70, 0.4)',
    marginLeft: 8,
  },
  titleInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  episodeTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  qualityBadge: {
    backgroundColor: 'rgba(230, 57, 70, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  qualityText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  aspectBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aspectText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBar: {
    backgroundColor: 'rgba(10, 15, 29, 0.94)',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 50,
  },
  scrubberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scrubberTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 3,
    marginHorizontal: 12,
    justifyContent: 'center',
  },
  scrubberFill: {
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 3,
  },
  scrubberThumb: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFF',
    marginLeft: -7,
  },
  timeLabel: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  iconControlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  mainPlayBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E63946',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#E63946',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  speedLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  controlSubText: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  lockedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 35,
  },
  floatingLockBtn: {
    position: 'absolute',
    top: 24,
    left: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1.5,
    borderColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  unlockPromptBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.4)',
    alignItems: 'center',
    elevation: 10,
  },
  unlockPromptText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  unlockActionBtn: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unlockActionBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  speedOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1100,
    elevation: 35,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedModalContent: {
    width: '80%',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  speedModalTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  speedOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
  },
  speedOptionItemActive: {
    backgroundColor: 'rgba(255, 107, 0, 0.15)',
  },
  speedOptionText: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '600',
  },
  speedOptionTextActive: {
    color: '#FF6B00',
    fontWeight: 'bold',
  },
});
