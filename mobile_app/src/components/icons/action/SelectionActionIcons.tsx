import React from 'react';
import { View, Text } from 'react-native';
import { IconRenderContext } from '../ActionIcons';

export function renderSelectionActionIcon(name: string, ctx: IconRenderContext): React.ReactNode | null {
  const { size, color, strokeWidth, filled, containerStyle } = ctx;

  switch (name) {
    case 'check': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.32,
              height: size * 0.58,
              borderBottomWidth: strokeWidth,
              borderRightWidth: strokeWidth,
              borderColor: color,
              borderRadius: 1,
              transform: [{ rotate: '45deg' }],
              marginBottom: 2,
            }}
          />
        </View>
      );
    }

    case 'close': {
      const crossLen = size * 0.65;
      return (
        <View style={containerStyle}>
          <View
            style={{
              position: 'absolute',
              width: crossLen,
              height: strokeWidth,
              backgroundColor: color,
              borderRadius: strokeWidth,
              transform: [{ rotate: '45deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: crossLen,
              height: strokeWidth,
              backgroundColor: color,
              borderRadius: strokeWidth,
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View>
      );
    }

    case 'done_all': {
      return (
        <View style={containerStyle}>
          <View style={{ flexDirection: 'row', marginLeft: 4 }}>
            <Text style={{ color, fontSize: size * 0.6, fontWeight: '900', marginRight: -size * 0.2 }}>✓</Text>
            <Text style={{ color, fontSize: size * 0.6, fontWeight: '900' }}>✓</Text>
          </View>
        </View>
      );
    }

    case 'check_circle': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: (size * 0.8) / 2,
              backgroundColor: filled ? color : 'transparent',
              borderWidth: filled ? 0 : strokeWidth,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: filled ? '#0F131C' : color,
                fontSize: size * 0.48,
                fontWeight: '900',
              }}
            >
              ✓
            </Text>
          </View>
        </View>
      );
    }

    case 'check_box': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: 4,
              backgroundColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#0F131C', fontSize: size * 0.5, fontWeight: '900' }}>✓</Text>
          </View>
        </View>
      );
    }

    case 'check_box_outline_blank': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: 4,
              borderWidth: strokeWidth,
              borderColor: color,
            }}
          />
        </View>
      );
    }

    case 'heart': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.8 }}>♥</Text>
        </View>
      );
    }

    case 'favorite': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.85, lineHeight: size }}>♥</Text>
        </View>
      );
    }

    case 'thumbs-up': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.7, fontWeight: '700' }}>👍</Text>
        </View>
      );
    }

    case 'thumb_up': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.75, lineHeight: size }}>👍</Text>
        </View>
      );
    }

    case 'share': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.75, fontWeight: '700' }}>↗</Text>
        </View>
      );
    }

    case 'reply': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.75, fontWeight: '900' }}>↩</Text>
        </View>
      );
    }

    case 'chat': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.76,
              height: size * 0.54,
              borderWidth: strokeWidth,
              borderColor: color,
              borderRadius: 6,
              backgroundColor: filled ? color + '22' : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: size * 0.35, height: strokeWidth, backgroundColor: color }} />
          </View>
        </View>
      );
    }

    case 'forum': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.68,
              height: size * 0.5,
              borderRadius: 5,
              borderWidth: strokeWidth,
              borderColor: color,
              backgroundColor: filled ? color + '25' : 'transparent',
            }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 2,
              left: 3,
              width: 0,
              height: 0,
              borderTopWidth: 4,
              borderLeftWidth: 4,
              borderRightWidth: 4,
              borderTopColor: color,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
            }}
          />
        </View>
      );
    }

    default:
      return null;
  }
}
