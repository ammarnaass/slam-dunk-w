import React from 'react';
import { View, Text, Animated } from 'react-native';
import { gestureStyles } from '../styles/gesture.styles';

interface MXDoubleTapRippleProps {
  side: 'left' | 'right' | null;
  opacity: Animated.Value;
}

export const MXDoubleTapRipple: React.FC<MXDoubleTapRippleProps> = ({
  side,
  opacity,
}) => {
  if (!side) return null;

  const isLeft = side === 'left';

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        gestureStyles.rippleContainer,
        isLeft ? gestureStyles.rippleLeft : gestureStyles.rippleRight,
        { opacity },
      ]}
    >
      <View style={gestureStyles.rippleBadge}>
        <Text style={gestureStyles.rippleText}>
          {isLeft ? '⏪ 10- ثوانٍ' : '10+ ثوانٍ ⏩'}
        </Text>
      </View>
    </Animated.View>
  );
};
