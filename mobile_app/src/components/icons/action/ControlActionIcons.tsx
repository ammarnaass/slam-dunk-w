import React from 'react';
import { View, Text } from 'react-native';
import { IconRenderContext } from '../ActionIcons';

export function renderControlActionIcon(name: string, ctx: IconRenderContext): React.ReactNode | null {
  const { size, color, strokeWidth, filled, containerStyle } = ctx;

  switch (name) {
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

    case 'visibility': {
      const eyeW = size * 0.8;
      const eyeH = size * 0.48;
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: eyeW,
              height: eyeH,
              borderRadius: eyeH / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: size * 0.22,
                height: size * 0.22,
                borderRadius: (size * 0.22) / 2,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      );
    }

    case 'visibility_off': {
      const eyeW = size * 0.8;
      const eyeH = size * 0.48;
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: eyeW,
              height: eyeH,
              borderRadius: eyeH / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.6,
            }}
          >
            <View
              style={{
                width: size * 0.18,
                height: size * 0.18,
                borderRadius: (size * 0.18) / 2,
                backgroundColor: color,
              }}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              width: size * 0.85,
              height: strokeWidth,
              backgroundColor: color,
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View>
      );
    }

    default:
      return null;
  }
}
