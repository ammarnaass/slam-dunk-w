import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { Icon } from '../Icon';
import { THEME } from '../../constants/theme';

interface MXGestureOverlayProps {
  duration: number; // in seconds
  currentTime: number; // in seconds
  volume: number; // 0 to 1
  brightness: number; // 0 to 1
  isLocked: boolean;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onBrightnessChange: (brightness: number) => void;
  onSingleTap: () => void;
  onDoubleTapSkip: (direction: 'forward' | 'backward') => void;
  children?: React.ReactNode;
}

export const MXGestureOverlay: React.FC<MXGestureOverlayProps> = ({
  duration,
  currentTime,
  volume,
  brightness,
  isLocked,
  onSeek,
  onVolumeChange,
  onBrightnessChange,
  onSingleTap,
  onDoubleTapSkip,
  children,
}) => {
  const [activeGesture, setActiveGesture] = useState<'none' | 'brightness' | 'volume' | 'seek'>('none');
  const [seekOffset, setSeekOffset] = useState<number>(0);
  const [doubleTapSide, setDoubleTapSide] = useState<'left' | 'right' | null>(null);

  // Gesture tracking refs
  const initialTouchX = useRef<number>(0);
  const initialTouchY = useRef<number>(0);
  const initialVolume = useRef<number>(volume);
  const initialBrightness = useRef<number>(brightness);
  const initialSeekTime = useRef<number>(currentTime);
  const lastTapTime = useRef<number>(0);
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animated values for visual feedback
  const rippleOpacity = useRef(new Animated.Value(0)).current;

  const triggerDoubleTapRipple = useCallback((side: 'left' | 'right') => {
    setDoubleTapSide(side);
    rippleOpacity.setValue(1);
    Animated.timing(rippleOpacity, {
      toValue: 0,
      duration: 650,
      useNativeDriver: true,
    }).start(() => setDoubleTapSide(null));
  }, [rippleOpacity]);

  // Keep mutable ref to avoid stale closures in panResponder
  const propsRef = useRef({
    duration,
    currentTime,
    volume,
    brightness,
    isLocked,
    onSeek,
    onVolumeChange,
    onBrightnessChange,
    onSingleTap,
    onDoubleTapSkip,
  });
  propsRef.current = {
    duration,
    currentTime,
    volume,
    brightness,
    isLocked,
    onSeek,
    onVolumeChange,
    onBrightnessChange,
    onSingleTap,
    onDoubleTapSkip,
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (propsRef.current.isLocked) return false;
        return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: (evt) => {
        if (propsRef.current.isLocked) return;
        const { locationX, locationY } = evt.nativeEvent;
        initialTouchX.current = locationX;
        initialTouchY.current = locationY;
        initialVolume.current = propsRef.current.volume;
        initialBrightness.current = propsRef.current.brightness;
        initialSeekTime.current = propsRef.current.currentTime;
        setSeekOffset(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (propsRef.current.isLocked) return;
        const { dx, dy } = gestureState;
        const windowWidth = Dimensions.get('window').width;
        const isHorizontal = Math.abs(dx) > Math.abs(dy);

        if (isHorizontal) {
          // Horizontal Seek gesture (MX Player style)
          setActiveGesture('seek');
          // Scale: 1 pixel drag = ~0.35 seconds
          const targetOffset = Math.round(dx * 0.35);
          const cur = propsRef.current.currentTime;
          const dur = propsRef.current.duration;
          const clampedOffset = Math.max(-cur, Math.min(dur - cur, targetOffset));
          setSeekOffset(clampedOffset);
        } else {
          // Vertical gesture: Left half is brightness, Right half is volume
          const isLeftHalf = initialTouchX.current < windowWidth / 2;
          const deltaChange = -dy / 200; // Drag up increases, drag down decreases

          if (isLeftHalf) {
            setActiveGesture('brightness');
            const newBrightness = Math.max(0, Math.min(1, initialBrightness.current + deltaChange));
            propsRef.current.onBrightnessChange(newBrightness);
          } else {
            setActiveGesture('volume');
            const newVolume = Math.max(0, Math.min(1, initialVolume.current + deltaChange));
            propsRef.current.onVolumeChange(newVolume);
          }
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        const isTap = Math.abs(dx) < 6 && Math.abs(dy) < 6;

        if (isTap) {
          const now = Date.now();
          const DOUBLE_TAP_DELAY = 280;
          const windowWidth = Dimensions.get('window').width;
          const tapX = evt.nativeEvent.locationX;

          if (now - lastTapTime.current < DOUBLE_TAP_DELAY) {
            // Double Tap Detected
            if (singleTapTimer.current) {
              clearTimeout(singleTapTimer.current);
              singleTapTimer.current = null;
            }
            if (!propsRef.current.isLocked) {
              if (tapX < windowWidth * 0.35) {
                // Double tap on Left: Rewind 10s
                triggerDoubleTapRipple('left');
                propsRef.current.onDoubleTapSkip('backward');
              } else if (tapX > windowWidth * 0.65) {
                // Double tap on Right: Fast-forward 10s
                triggerDoubleTapRipple('right');
                propsRef.current.onDoubleTapSkip('forward');
              } else {
                // Double tap in Center: Toggle HUD
                propsRef.current.onSingleTap();
              }
            }
            lastTapTime.current = 0;
          } else {
            // Single Tap: schedule to see if a second tap follows
            lastTapTime.current = now;
            singleTapTimer.current = setTimeout(() => {
              propsRef.current.onSingleTap();
              singleTapTimer.current = null;
            }, DOUBLE_TAP_DELAY);
          }
        } else {
          // Finished drag gesture
          if (activeGesture === 'seek' && seekOffset !== 0) {
            const finalTime = Math.max(0, Math.min(propsRef.current.duration, initialSeekTime.current + seekOffset));
            propsRef.current.onSeek(finalTime);
          }
          setActiveGesture('none');
          setSeekOffset(0);
        }
      },
    })
  ).current;

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.floor(Math.max(0, seconds) % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const previewTime = Math.max(0, Math.min(duration, currentTime + seekOffset));

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}

      {/* Screen Dimmer according to Brightness */}
      <View
        pointerEvents="none"
        style={[
          styles.brightnessOverlay,
          { opacity: (1 - brightness) * 0.72 },
        ]}
      />

      {/* Center Feedback Indicators (MX Player Style) */}
      {activeGesture === 'volume' && (
        <View style={styles.feedbackPill}>
          <Icon name={volume === 0 ? 'volume_mute' : 'volume_up'} size={28} color="#FFF" />
          <View style={styles.gaugeTrack}>
            <View style={[styles.gaugeFill, { width: `${Math.round(volume * 100)}%`, backgroundColor: '#FF6B00' }]} />
          </View>
          <Text style={styles.feedbackText}>{Math.round(volume * 100)}%</Text>
        </View>
      )}

      {activeGesture === 'brightness' && (
        <View style={styles.feedbackPill}>
          <Icon name="brightness" size={28} color="#FFD700" />
          <View style={styles.gaugeTrack}>
            <View style={[styles.gaugeFill, { width: `${Math.round(brightness * 100)}%`, backgroundColor: '#FFD700' }]} />
          </View>
          <Text style={styles.feedbackText}>{Math.round(brightness * 100)}%</Text>
        </View>
      )}

      {activeGesture === 'seek' && (
        <View style={styles.seekPill}>
          <Text style={[styles.seekDeltaText, { color: seekOffset >= 0 ? '#4ADE80' : '#F87171' }]}>
            {seekOffset >= 0 ? `+${seekOffset}s` : `${seekOffset}s`}
          </Text>
          <Text style={styles.seekTimeText}>
            [{formatTime(previewTime)} / {formatTime(duration)}]
          </Text>
        </View>
      )}

      {/* Double Tap Ripple Indicators */}
      {doubleTapSide === 'left' && (
        <Animated.View style={[styles.rippleContainer, styles.rippleLeft, { opacity: rippleOpacity }]}>
          <View style={styles.rippleBadge}>
            <Text style={styles.rippleText}>⏪ 10- ثوانٍ</Text>
          </View>
        </Animated.View>
      )}

      {doubleTapSide === 'right' && (
        <Animated.View style={[styles.rippleContainer, styles.rippleRight, { opacity: rippleOpacity }]}>
          <View style={styles.rippleBadge}>
            <Text style={styles.rippleText}>10+ ثوانٍ ⏩</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  brightnessOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
  },
  feedbackPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  gaugeTrack: {
    width: 100,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginVertical: 10,
    overflow: 'hidden',
  },
  gaugeFill: {
    height: '100%',
    borderRadius: 3,
  },
  feedbackText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  seekPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    elevation: 8,
  },
  seekDeltaText: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  seekTimeText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  rippleContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rippleLeft: {
    left: 0,
  },
  rippleRight: {
    right: 0,
  },
  rippleBadge: {
    backgroundColor: 'rgba(230, 57, 70, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  rippleText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
