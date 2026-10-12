import React from 'react';
import { View, Text } from 'react-native';

export interface IconRenderContext {
  size: number;
  color: string;
  strokeWidth: number;
  filled: boolean;
  containerStyle: {
    width: number;
    height: number;
    alignItems: 'center';
    justifyContent: 'center';
  };
}

export function renderActionIcon(name: string, ctx: IconRenderContext): React.ReactNode | null {
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

    case 'filter': {
      return (
        <View style={containerStyle}>
          <Text
            style={{
              color,
              fontSize: size * 0.8,
              fontWeight: '900',
              textAlign: 'center',
              lineHeight: size,
            }}
          >
            ▼
          </Text>
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

    case 'bookmark': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.55,
              height: size * 0.72,
              borderWidth: strokeWidth,
              borderColor: color,
              backgroundColor: filled ? color : 'transparent',
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
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

    case 'trash': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.55,
              height: strokeWidth,
              backgroundColor: color,
              marginBottom: 2,
            }}
          />
          <View
            style={{
              width: size * 0.48,
              height: size * 0.52,
              borderWidth: strokeWidth,
              borderTopWidth: 0,
              borderColor: color,
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
            }}
          />
        </View>
      );
    }

    case 'lock': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.44,
              height: size * 0.36,
              borderTopLeftRadius: size * 0.22,
              borderTopRightRadius: size * 0.22,
              borderWidth: strokeWidth,
              borderBottomWidth: 0,
              borderColor: color,
              marginBottom: -1,
            }}
          />
          <View
            style={{
              width: size * 0.6,
              height: size * 0.44,
              backgroundColor: color,
              borderRadius: 4,
            }}
          />
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

    case 'reply': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.75, fontWeight: '900' }}>↩</Text>
        </View>
      );
    }

    case 'swap_vert':
    case 'swap-vert': {
      return (
        <View style={containerStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            {/* Arrow up */}
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: size * 0.12,
                  borderRightWidth: size * 0.12,
                  borderBottomWidth: size * 0.18,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: color,
                }}
              />
              <View style={{ width: strokeWidth, height: size * 0.35, backgroundColor: color }} />
            </View>
            {/* Arrow down */}
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: strokeWidth, height: size * 0.35, backgroundColor: color }} />
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: size * 0.12,
                  borderRightWidth: size * 0.12,
                  borderTopWidth: size * 0.18,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: color,
                }}
              />
            </View>
          </View>
        </View>
      );
    }

    case 'lock_open':
    case 'lock-open': {
      const lockW = size * 0.58;
      const lockH = size * 0.44;
      return (
        <View style={containerStyle}>
          {/* Shackle Open */}
          <View
            style={{
              width: lockW * 0.72,
              height: size * 0.38,
              borderTopLeftRadius: lockW * 0.36,
              borderTopRightRadius: lockW * 0.36,
              borderWidth: strokeWidth,
              borderBottomWidth: 0,
              borderColor: color,
              marginBottom: -size * 0.08,
              alignSelf: 'flex-start',
              marginLeft: 2,
              transform: [{ translateY: -2 }],
            }}
          />
          {/* Lock Body */}
          <View
            style={{
              width: lockW,
              height: lockH,
              borderRadius: 4,
              borderWidth: strokeWidth,
              borderColor: color,
              backgroundColor: filled ? color + '30' : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: 2, height: 4, backgroundColor: color, borderRadius: 1 }} />
          </View>
        </View>
      );
    }

    case 'bookmark_add':
    case 'bookmark-add': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.48,
              height: size * 0.65,
              borderWidth: strokeWidth,
              borderBottomWidth: 0,
              borderColor: color,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
              alignItems: 'center',
            }}
          >
            <View
              style={{
                position: 'absolute',
                bottom: -size * 0.15,
                width: 0,
                height: 0,
                borderLeftWidth: (size * 0.48) / 2,
                borderRightWidth: (size * 0.48) / 2,
                borderTopWidth: size * 0.18,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: color,
              }}
            />
          </View>
          {/* Plus badge */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: size * 0.35,
              height: size * 0.35,
              borderRadius: (size * 0.35) / 2,
              backgroundColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#131317', fontSize: size * 0.28, fontWeight: '900', lineHeight: size * 0.32 }}>+</Text>
          </View>
        </View>
      );
    }

    case 'bookmark_border': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.52,
              height: size * 0.7,
              borderWidth: strokeWidth,
              borderColor: color,
              borderBottomWidth: 0,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            }}
          >
            <View
              style={{
                position: 'absolute',
                bottom: -size * 0.18,
                width: 0,
                height: 0,
                borderLeftWidth: (size * 0.52) / 2,
                borderRightWidth: (size * 0.52) / 2,
                borderTopWidth: size * 0.2,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderTopColor: color,
              }}
            />
          </View>
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

    case 'tune': {
      return (
        <View style={containerStyle}>
          <View style={{ width: size * 0.8, gap: 4 }}>
            <View style={{ height: strokeWidth, backgroundColor: color, width: '100%' }}>
              <View style={{ position: 'absolute', left: 4, top: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
            </View>
            <View style={{ height: strokeWidth, backgroundColor: color, width: '100%' }}>
              <View style={{ position: 'absolute', right: 4, top: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
            </View>
          </View>
        </View>
      );
    }

    case 'sort': {
      return (
        <View style={containerStyle}>
          <View style={{ width: size * 0.7, gap: 3.5, alignItems: 'flex-start' }}>
            <View style={{ width: size * 0.7, height: strokeWidth, backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: size * 0.48, height: strokeWidth, backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: size * 0.25, height: strokeWidth, backgroundColor: color, borderRadius: 1 }} />
          </View>
        </View>
      );
    }

    case 'checklist': {
      return (
        <View style={containerStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Text style={{ color, fontSize: size * 0.5, fontWeight: 'bold' }}>✓</Text>
            <View style={{ gap: 3 }}>
              <View style={{ width: size * 0.4, height: strokeWidth, backgroundColor: color }} />
              <View style={{ width: size * 0.3, height: strokeWidth, backgroundColor: color }} />
            </View>
          </View>
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

    case 'delete':
    case 'delete_forever': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.56,
              height: size * 0.6,
              borderWidth: strokeWidth,
              borderColor: color,
              borderTopWidth: 0,
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: strokeWidth, height: size * 0.35, backgroundColor: color }} />
          </View>
          <View
            style={{
              position: 'absolute',
              top: size * 0.16,
              width: size * 0.72,
              height: strokeWidth,
              backgroundColor: color,
              borderRadius: 1,
            }}
          />
        </View>
      );
    }

    case 'delete_sweep': {
      return (
        <View style={containerStyle}>
          <View style={{ width: size * 0.7, gap: 2.5, alignItems: 'flex-start' }}>
            <View style={{ width: size * 0.65, height: strokeWidth, backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: size * 0.45, height: strokeWidth, backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: size * 0.28, height: strokeWidth, backgroundColor: color, borderRadius: 1 }} />
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

    default:
      return null;
  }
}
