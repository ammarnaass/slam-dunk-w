import { useRef, useState, useCallback, useMemo } from 'react';
import { PanResponder, Animated, Dimensions } from 'react-native';
import { ActiveGestureType, DoubleTapDirection } from '../types/player.types';
import { DOUBLE_TAP_DELAY_MS } from '../constants/player.constants';

interface UsePlayerGesturesParams {
  duration: number;
  currentTime: number;
  volume: number;
  brightness: number;
  isLocked: boolean;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onBrightnessChange: (brightness: number) => void;
  onSingleTap: () => void;
  onDoubleTapSkip: (direction: DoubleTapDirection) => void;
}

export function usePlayerGestures(params: UsePlayerGesturesParams) {
  const [activeGesture, setActiveGesture] = useState<ActiveGestureType>('none');
  const [seekOffset, setSeekOffset] = useState<number>(0);
  const [doubleTapSide, setDoubleTapSide] = useState<'left' | 'right' | null>(null);

  const initialTouchX = useRef<number>(0);
  const initialTouchY = useRef<number>(0);
  const initialVolume = useRef<number>(params.volume);
  const initialBrightness = useRef<number>(params.brightness);
  const initialSeekTime = useRef<number>(params.currentTime);
  const lastTapTime = useRef<number>(0);
  const singleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const paramsRef = useRef(params);
  paramsRef.current = params;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          if (paramsRef.current.isLocked) return false;
          return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
        },
        onPanResponderGrant: (evt) => {
          if (paramsRef.current.isLocked) return;
          const { locationX, locationY } = evt.nativeEvent;
          initialTouchX.current = locationX;
          initialTouchY.current = locationY;
          initialVolume.current = paramsRef.current.volume;
          initialBrightness.current = paramsRef.current.brightness;
          initialSeekTime.current = paramsRef.current.currentTime;
          setSeekOffset(0);
        },
        onPanResponderMove: (_, gestureState) => {
          if (paramsRef.current.isLocked) return;
          const { dx, dy } = gestureState;
          const windowWidth = Dimensions.get('window').width;
          const isHorizontal = Math.abs(dx) > Math.abs(dy);

          if (isHorizontal) {
            setActiveGesture('seek');
            const targetOffset = Math.round(dx * 0.35);
            const cur = paramsRef.current.currentTime;
            const dur = paramsRef.current.duration;
            setSeekOffset(Math.max(-cur, Math.min(dur - cur, targetOffset)));
          } else {
            const isLeftHalf = initialTouchX.current < windowWidth / 2;
            const deltaChange = -dy / 200;

            if (isLeftHalf) {
              setActiveGesture('brightness');
              const next = Math.max(0, Math.min(1, initialBrightness.current + deltaChange));
              paramsRef.current.onBrightnessChange(next);
            } else {
              setActiveGesture('volume');
              const next = Math.max(0, Math.min(1, initialVolume.current + deltaChange));
              paramsRef.current.onVolumeChange(next);
            }
          }
        },
        onPanResponderRelease: (evt, gestureState) => {
          const { dx, dy } = gestureState;
          const isTap = Math.abs(dx) < 6 && Math.abs(dy) < 6;

          if (isTap) {
            const now = Date.now();
            const windowWidth = Dimensions.get('window').width;
            const tapX = evt.nativeEvent.locationX;

            if (now - lastTapTime.current < DOUBLE_TAP_DELAY_MS) {
              if (singleTapTimer.current) {
                clearTimeout(singleTapTimer.current);
                singleTapTimer.current = null;
              }
              if (!paramsRef.current.isLocked) {
                if (tapX < windowWidth * 0.35) {
                  triggerDoubleTapRipple('left');
                  paramsRef.current.onDoubleTapSkip('backward');
                } else if (tapX > windowWidth * 0.65) {
                  triggerDoubleTapRipple('right');
                  paramsRef.current.onDoubleTapSkip('forward');
                } else {
                  paramsRef.current.onSingleTap();
                }
              }
              lastTapTime.current = 0;
            } else {
              lastTapTime.current = now;
              singleTapTimer.current = setTimeout(() => {
                paramsRef.current.onSingleTap();
                singleTapTimer.current = null;
              }, DOUBLE_TAP_DELAY_MS);
            }
          } else {
            if (activeGesture === 'seek' && seekOffset !== 0) {
              const finalTime = Math.max(
                0,
                Math.min(paramsRef.current.duration, initialSeekTime.current + seekOffset)
              );
              paramsRef.current.onSeek(finalTime);
            }
            setActiveGesture('none');
            setSeekOffset(0);
          }
        },
      }),
    [activeGesture, seekOffset, triggerDoubleTapRipple]
  );

  return {
    panHandlers: panResponder.panHandlers,
    activeGesture,
    seekOffset,
    doubleTapSide,
    rippleOpacity,
  };
}
