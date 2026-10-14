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

export function renderFeatureIcon(name: string, ctx: IconRenderContext): React.ReactNode | null {
  const { size, color, strokeWidth, filled, containerStyle } = ctx;

  switch (name) {
    case 'basketball': {
      const ballR = size * 0.42;
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: ballR * 2,
              height: ballR * 2,
              borderRadius: ballR,
              borderWidth: strokeWidth,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: filled ? color + '22' : 'transparent',
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: strokeWidth,
                backgroundColor: color,
              }}
            />
            <View
              style={{
                position: 'absolute',
                height: '100%',
                width: strokeWidth,
                backgroundColor: color,
              }}
            />
            <View
              style={{
                position: 'absolute',
                width: ballR * 2.2,
                height: ballR * 2.2,
                borderRadius: ballR * 1.1,
                borderWidth: strokeWidth,
                borderColor: color,
                left: -ballR * 0.7,
              }}
            />
          </View>
        </View>
      );
    }

    case 'flame': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.55,
              height: size * 0.75,
              backgroundColor: color,
              borderTopLeftRadius: size * 0.5,
              borderTopRightRadius: 2,
              borderBottomLeftRadius: size * 0.28,
              borderBottomRightRadius: size * 0.28,
              transform: [{ rotate: '-45deg' }],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: size * 0.22,
                height: size * 0.32,
                backgroundColor: '#FFFFFF',
                borderRadius: size * 0.12,
              }}
            />
          </View>
        </View>
      );
    }

    case 'star': {
      return (
        <View style={containerStyle}>
          <Text
            style={{
              color,
              fontSize: size * 0.85,
              fontWeight: '900',
              textAlign: 'center',
              lineHeight: size,
            }}
          >
            ★
          </Text>
        </View>
      );
    }

    case 'sparkles': {
      return (
        <View style={containerStyle}>
          <Text
            style={{
              color,
              fontSize: size * 0.85,
              fontWeight: '900',
              textAlign: 'center',
              lineHeight: size,
            }}
          >
            ✦
          </Text>
        </View>
      );
    }

    case 'settings': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.72,
              height: size * 0.72,
              borderRadius: size * 0.36,
              borderWidth: strokeWidth,
              borderColor: color,
              borderStyle: 'dashed',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: size * 0.28,
                height: size * 0.28,
                borderRadius: size * 0.14,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      );
    }

    case 'tool': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.38,
              height: size * 0.38,
              borderRadius: size * 0.19,
              borderWidth: strokeWidth,
              borderColor: color,
            }}
          />
          <View
            style={{
              width: strokeWidth * 1.5,
              height: size * 0.42,
              backgroundColor: color,
              borderRadius: 1,
              transform: [{ rotate: '45deg' }],
              marginTop: -2,
            }}
          />
        </View>
      );
    }

    case 'crown': {
      return (
        <View style={containerStyle}>
          <Text
            style={{
              color,
              fontSize: size * 0.9,
              textAlign: 'center',
              lineHeight: size,
            }}
          >
            👑
          </Text>
        </View>
      );
    }

    case 'bell': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.58,
              height: size * 0.6,
              borderTopLeftRadius: size * 0.3,
              borderTopRightRadius: size * 0.3,
              borderWidth: strokeWidth,
              borderBottomWidth: 0,
              borderColor: color,
              alignItems: 'center',
            }}
          />
          <View
            style={{
              width: size * 0.74,
              height: strokeWidth,
              backgroundColor: color,
              borderRadius: 1,
            }}
          />
          <View
            style={{
              width: size * 0.22,
              height: size * 0.12,
              backgroundColor: color,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
              marginTop: 1,
            }}
          />
        </View>
      );
    }

    case 'clock': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.85,
              height: size * 0.85,
              borderRadius: (size * 0.85) / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                position: 'absolute',
                width: strokeWidth,
                height: size * 0.3,
                backgroundColor: color,
                top: size * 0.12,
                borderRadius: 1,
              }}
            />
            <View
              style={{
                position: 'absolute',
                height: strokeWidth,
                width: size * 0.24,
                backgroundColor: color,
                right: size * 0.15,
                borderRadius: 1,
              }}
            />
          </View>
        </View>
      );
    }

    case 'wifiOff': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.75, fontWeight: '900' }}>✕</Text>
        </View>
      );
    }

    case 'radar': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.85,
              height: size * 0.85,
              borderRadius: (size * 0.85) / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: size * 0.4,
                height: size * 0.4,
                borderRadius: (size * 0.4) / 2,
                borderWidth: strokeWidth,
                borderColor: color,
              }}
            />
          </View>
        </View>
      );
    }

    case 'shield-check': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.7,
              height: size * 0.8,
              borderWidth: strokeWidth,
              borderColor: color,
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
              borderBottomLeftRadius: size * 0.35,
              borderBottomRightRadius: size * 0.35,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: filled ? color + '25' : 'transparent',
            }}
          >
            <Text style={{ color, fontSize: size * 0.45, fontWeight: '900', marginTop: -2 }}>✓</Text>
          </View>
        </View>
      );
    }

    case 'mic': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.32,
              height: size * 0.5,
              borderRadius: size * 0.16,
              borderWidth: strokeWidth,
              borderColor: color,
              backgroundColor: filled ? color : 'transparent',
            }}
          />
          <View
            style={{
              width: size * 0.52,
              height: size * 0.28,
              borderBottomLeftRadius: size * 0.26,
              borderBottomRightRadius: size * 0.26,
              borderWidth: strokeWidth,
              borderTopWidth: 0,
              borderColor: color,
              marginTop: -size * 0.12,
            }}
          />
          <View style={{ width: strokeWidth, height: size * 0.15, backgroundColor: color }} />
        </View>
      );
    }

    case 'zap':
    case 'bolt': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.8, fontWeight: '900', lineHeight: size }}>⚡</Text>
        </View>
      );
    }

    case 'verified': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: size * 0.4,
              borderWidth: strokeWidth,
              borderColor: color,
              backgroundColor: filled ? color + '25' : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: size * 0.32,
                height: size * 0.18,
                borderBottomWidth: strokeWidth + 0.5,
                borderLeftWidth: strokeWidth + 0.5,
                borderColor: color,
                transform: [{ rotate: '-45deg' }],
                marginBottom: 2,
              }}
            />
          </View>
        </View>
      );
    }

    case 'notifications':
    case 'notifications_active': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.55,
              height: size * 0.55,
              borderTopLeftRadius: size * 0.28,
              borderTopRightRadius: size * 0.28,
              borderWidth: strokeWidth,
              borderColor: color,
              backgroundColor: filled ? color : 'transparent',
            }}
          />
          <View style={{ width: size * 0.72, height: strokeWidth, backgroundColor: color }} />
          <View style={{ width: 4, height: 3, borderRadius: 2, backgroundColor: color, marginTop: 1 }} />
        </View>
      );
    }

    case 'schedule': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: (size * 0.8) / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: strokeWidth, height: size * 0.25, backgroundColor: color, marginTop: -2 }} />
            <View
              style={{
                width: size * 0.2,
                height: strokeWidth,
                backgroundColor: color,
                position: 'absolute',
                top: size * 0.38,
                right: size * 0.2,
              }}
            />
          </View>
        </View>
      );
    }

    case 'format_quote': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.9, fontWeight: '900', lineHeight: size * 0.9 }}>“</Text>
        </View>
      );
    }

    case 'flag': {
      return (
        <View style={containerStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{ width: strokeWidth, height: size * 0.75, backgroundColor: color }} />
            <View
              style={{
                width: size * 0.4,
                height: size * 0.3,
                borderWidth: strokeWidth,
                borderColor: color,
                backgroundColor: filled ? color : 'transparent',
              }}
            />
          </View>
        </View>
      );
    }

    case 'sentiment_satisfied': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: (size * 0.8) / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ flexDirection: 'row', gap: 5, marginBottom: 2 }}>
              <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color }} />
              <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color }} />
            </View>
            <View
              style={{
                width: size * 0.35,
                height: size * 0.16,
                borderBottomLeftRadius: size * 0.18,
                borderBottomRightRadius: size * 0.18,
                borderWidth: strokeWidth,
                borderTopWidth: 0,
                borderColor: color,
              }}
            />
          </View>
        </View>
      );
    }

    case 'stars':
    case 'workspace_premium': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.8, lineHeight: size }}>★</Text>
        </View>
      );
    }

    case 'local_fire_department': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.8, lineHeight: size }}>🔥</Text>
        </View>
      );
    }

    case 'memory': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.55,
              height: size * 0.55,
              borderRadius: 3,
              borderWidth: strokeWidth,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: 4, height: 4, backgroundColor: color }} />
          </View>
        </View>
      );
    }

    case 'photo_camera': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.7,
              height: size * 0.5,
              borderRadius: 3,
              borderWidth: strokeWidth,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: size * 0.25,
                height: size * 0.25,
                borderRadius: (size * 0.25) / 2,
                borderWidth: strokeWidth,
                borderColor: color,
              }}
            />
          </View>
        </View>
      );
    }

    case 'calendar_month': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.68,
              height: size * 0.62,
              borderRadius: 3,
              borderWidth: strokeWidth,
              borderColor: color,
            }}
          >
            <View style={{ height: strokeWidth + 2, backgroundColor: color }} />
          </View>
        </View>
      );
    }

    case 'cleaning_services':
    case 'auto_delete': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.75, lineHeight: size }}>✨</Text>
        </View>
      );
    }

    case 'sports_basketball': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: (size * 0.8) / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ width: '100%', height: strokeWidth, backgroundColor: color }} />
            <View
              style={{
                position: 'absolute',
                width: strokeWidth,
                height: '100%',
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      );
    }

    case 'search_insights': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.52,
              height: size * 0.52,
              borderRadius: (size * 0.52) / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              position: 'relative',
            }}
          />
          <View
            style={{
              width: strokeWidth,
              height: size * 0.35,
              backgroundColor: color,
              transform: [{ rotate: '-45deg' }],
              position: 'absolute',
              bottom: size * 0.1,
              right: size * 0.12,
            }}
          />
        </View>
      );
    }

    case 'swords': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.65,
              height: strokeWidth,
              backgroundColor: color,
              transform: [{ rotate: '45deg' }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: size * 0.65,
              height: strokeWidth,
              backgroundColor: color,
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View>
      );
    }

    case 'translate': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.65, fontWeight: '800' }}>文</Text>
        </View>
      );
    }

    case 'signal_cellular_alt_2_bar': {
      return (
        <View style={[containerStyle, { flexDirection: 'row', alignItems: 'flex-end', gap: 2, paddingBottom: 2 }]}>
          <View style={{ width: strokeWidth * 1.5, height: size * 0.35, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: strokeWidth * 1.5, height: size * 0.55, backgroundColor: color, borderRadius: 1 }} />
          <View style={{ width: strokeWidth * 1.5, height: size * 0.75, backgroundColor: color + '44', borderRadius: 1 }} />
        </View>
      );
    }

    case 'record_voice_over': {
      return (
        <View style={[containerStyle, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
          <View
            style={{
              width: size * 0.42,
              height: size * 0.42,
              borderRadius: size * 0.21,
              borderWidth: strokeWidth,
              borderColor: color,
              marginRight: 2,
            }}
          />
          <View style={{ flexDirection: 'column', gap: 2 }}>
            <View style={{ width: strokeWidth * 1.5, height: 4, backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: strokeWidth * 2.5, height: 6, backgroundColor: color, borderRadius: 1 }} />
            <View style={{ width: strokeWidth * 1.5, height: 4, backgroundColor: color, borderRadius: 1 }} />
          </View>
        </View>
      );
    }

    case 'category': {
      return (
        <View style={[containerStyle, { flexDirection: 'row', flexWrap: 'wrap', width: size * 0.7, height: size * 0.7, justifyContent: 'space-between', alignContent: 'space-between' }]}>
          <View style={{ width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14, backgroundColor: color }} />
          <View style={{ width: size * 0.28, height: size * 0.28, backgroundColor: color, transform: [{ rotate: '45deg' }] }} />
          <View style={{ width: size * 0.28, height: size * 0.28, borderRadius: 2, backgroundColor: color }} />
          <View style={{ width: size * 0.28, height: size * 0.28, borderWidth: strokeWidth, borderColor: color }} />
        </View>
      );
    }

    case 'auto_awesome': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.75, fontWeight: '900', lineHeight: size }}>✦</Text>
        </View>
      );
    }

    case 'hotel_class': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.75, fontWeight: '800' }}>★</Text>
        </View>
      );
    }

    default:
      return null;
  }
}
