import React from 'react';
import { View, Text } from 'react-native';
import { IconRenderContext } from '../ActionIcons';

export function renderSystemAuthActionIcon(name: string, ctx: IconRenderContext): React.ReactNode | null {
  const { size, color, strokeWidth, filled, containerStyle } = ctx;

  switch (name) {
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

    case 'lock_reset': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.6,
              height: size * 0.5,
              borderWidth: strokeWidth,
              borderColor: color,
              borderRadius: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color, fontSize: size * 0.3, fontWeight: '900' }}>↺</Text>
          </View>
        </View>
      );
    }

    case 'verified_user': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.65,
              height: size * 0.75,
              borderWidth: strokeWidth,
              borderColor: color,
              borderBottomLeftRadius: size * 0.35,
              borderBottomRightRadius: size * 0.35,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color, fontSize: size * 0.35, fontWeight: '900' }}>✓</Text>
          </View>
        </View>
      );
    }

    case 'login': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.55,
              height: size * 0.7,
              borderWidth: strokeWidth,
              borderLeftWidth: 0,
              borderColor: color,
              borderRadius: 2,
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color,
                fontSize: size * 0.45,
                fontWeight: '900',
                marginLeft: -size * 0.2,
              }}
            >
              ➔
            </Text>
          </View>
        </View>
      );
    }

    case 'mail': {
      const mW = size * 0.75;
      const mH = size * 0.52;
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: mW,
              height: mH,
              borderWidth: strokeWidth,
              borderColor: color,
              borderRadius: 3,
              alignItems: 'center',
              justifyContent: 'flex-start',
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: mW * 0.7,
                height: mW * 0.7,
                borderBottomWidth: strokeWidth,
                borderRightWidth: strokeWidth,
                borderColor: color,
                transform: [{ rotate: '45deg' }, { translateY: -mW * 0.25 }],
              }}
            />
          </View>
        </View>
      );
    }

    case 'alternate_email': {
      return (
        <View style={containerStyle}>
          <Text
            style={{
              color,
              fontSize: size * 0.75,
              fontWeight: '700',
              includeFontPadding: false,
            }}
          >
            @
          </Text>
        </View>
      );
    }

    case 'badge': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.7,
              height: size * 0.55,
              borderWidth: strokeWidth,
              borderColor: color,
              borderRadius: 3,
              padding: 2,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <View
              style={{
                width: size * 0.22,
                height: size * 0.28,
                borderRadius: 2,
                backgroundColor: color,
              }}
            />
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ height: strokeWidth, backgroundColor: color, width: '100%' }} />
              <View style={{ height: strokeWidth, backgroundColor: color, width: '60%' }} />
            </View>
          </View>
        </View>
      );
    }

    case 'devices': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.6,
              height: size * 0.45,
              borderWidth: strokeWidth,
              borderColor: color,
              borderRadius: 2,
              marginBottom: 2,
            }}
          />
          <View style={{ width: size * 0.35, height: strokeWidth, backgroundColor: color }} />
        </View>
      );
    }

    case 'rocket_launch': {
      return (
        <View style={containerStyle}>
          <Text style={{ fontSize: size * 0.72 }}>🚀</Text>
        </View>
      );
    }

    case 'fast_forward': {
      return (
        <View style={[containerStyle, { flexDirection: 'row', alignItems: 'center' }]}>
          <Text style={{ color, fontSize: size * 0.5, fontWeight: '900' }}>▶▶</Text>
        </View>
      );
    }

    case 'hd': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              borderWidth: strokeWidth,
              borderColor: color,
              borderRadius: 3,
              paddingHorizontal: 2,
            }}
          >
            <Text style={{ color, fontSize: size * 0.36, fontWeight: '900' }}>HD</Text>
          </View>
        </View>
      );
    }

    case 'sports_mma': {
      return (
        <View style={containerStyle}>
          <Text style={{ fontSize: size * 0.7 }}>🥋</Text>
        </View>
      );
    }

    case 'psychology': {
      return (
        <View style={containerStyle}>
          <Text style={{ fontSize: size * 0.7 }}>🧠</Text>
        </View>
      );
    }

    case 'history_edu': {
      return (
        <View style={containerStyle}>
          <Text style={{ fontSize: size * 0.7 }}>📜</Text>
        </View>
      );
    }

    default:
      return null;
  }
}
