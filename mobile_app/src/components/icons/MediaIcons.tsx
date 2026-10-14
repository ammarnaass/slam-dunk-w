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

export function renderMediaIcon(name: string, ctx: IconRenderContext): React.ReactNode | null {
  const { size, color, strokeWidth, filled, containerStyle } = ctx;

  switch (name) {
    case 'play': {
      const pSize = size * 0.72;
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: pSize * 0.85,
              borderTopWidth: pSize * 0.5,
              borderBottomWidth: pSize * 0.5,
              borderStyle: 'solid',
              borderLeftColor: color,
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              marginLeft: 2,
            }}
          />
        </View>
      );
    }

    case 'server': {
      const barW = size * 0.8;
      const barH = size * 0.28;
      return (
        <View style={[containerStyle, { gap: 3 }]}>
          <View
            style={{
              width: barW,
              height: barH,
              borderRadius: 3,
              borderWidth: strokeWidth,
              borderColor: color,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 3,
            }}
          >
            <View
              style={{
                width: 3,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: color,
              }}
            />
          </View>
          <View
            style={{
              width: barW,
              height: barH,
              borderRadius: 3,
              borderWidth: strokeWidth,
              borderColor: color,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 3,
            }}
          >
            <View
              style={{
                width: 3,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      );
    }

    case 'download':
    case 'cloud_download': {
      return (
        <View style={containerStyle}>
          <View style={{ width: strokeWidth, height: size * 0.45, backgroundColor: color }} />
          <View
            style={{
              width: size * 0.35,
              height: size * 0.35,
              borderBottomWidth: strokeWidth,
              borderRightWidth: strokeWidth,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
              marginTop: -size * 0.22,
            }}
          />
          <View
            style={{
              width: size * 0.7,
              height: size * 0.22,
              borderWidth: strokeWidth,
              borderTopWidth: 0,
              borderColor: color,
              marginTop: 3,
            }}
          />
        </View>
      );
    }

    case 'film': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.8,
              height: size * 0.65,
              borderWidth: strokeWidth,
              borderColor: color,
              borderRadius: 3,
              justifyContent: 'space-between',
              paddingVertical: 2,
              paddingHorizontal: 1,
              backgroundColor: filled ? color + '20' : 'transparent',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ width: 2, height: 2, backgroundColor: color }} />
              <View style={{ width: 2, height: 2, backgroundColor: color }} />
              <View style={{ width: 2, height: 2, backgroundColor: color }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ width: 2, height: 2, backgroundColor: color }} />
              <View style={{ width: 2, height: 2, backgroundColor: color }} />
              <View style={{ width: 2, height: 2, backgroundColor: color }} />
            </View>
          </View>
        </View>
      );
    }

    case 'play-circle': {
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
                width: 0,
                height: 0,
                borderLeftWidth: size * 0.35,
                borderTopWidth: size * 0.22,
                borderBottomWidth: size * 0.22,
                borderStyle: 'solid',
                borderLeftColor: color,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                marginLeft: 2,
              }}
            />
          </View>
        </View>
      );
    }

    case 'video_library':
    case 'video-library': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: size * 0.68,
              height: size * 0.52,
              borderRadius: 3,
              borderWidth: strokeWidth,
              borderColor: color,
              opacity: 0.5,
            }}
          />
          <View
            style={{
              width: size * 0.68,
              height: size * 0.52,
              borderRadius: 3,
              borderWidth: strokeWidth,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: filled ? color + '30' : 'transparent',
              marginTop: 4,
              marginRight: 4,
            }}
          >
            <View
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: size * 0.16,
                borderTopWidth: size * 0.1,
                borderBottomWidth: size * 0.1,
                borderLeftColor: color,
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                marginLeft: 1,
              }}
            />
          </View>
        </View>
      );
    }

    case 'download_for_offline':
    case 'download-for-offline': {
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
              backgroundColor: filled ? color + '25' : 'transparent',
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: strokeWidth, height: size * 0.28, backgroundColor: color }} />
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: size * 0.12,
                  borderRightWidth: size * 0.12,
                  borderTopWidth: size * 0.14,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: color,
                }}
              />
              <View style={{ width: size * 0.4, height: strokeWidth, backgroundColor: color, marginTop: 2 }} />
            </View>
          </View>
        </View>
      );
    }

    case 'play_arrow': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: size * 0.45,
              borderTopWidth: size * 0.28,
              borderBottomWidth: size * 0.28,
              borderLeftColor: color,
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              marginLeft: 2,
            }}
          />
        </View>
      );
    }

    case 'pause': {
      return (
        <View style={containerStyle}>
          <View style={{ flexDirection: 'row', gap: size * 0.2 }}>
            <View style={{ width: size * 0.16, height: size * 0.55, borderRadius: 1.5, backgroundColor: color }} />
            <View style={{ width: size * 0.16, height: size * 0.55, borderRadius: 1.5, backgroundColor: color }} />
          </View>
        </View>
      );
    }

    case 'dns': {
      return (
        <View style={containerStyle}>
          <View style={{ gap: 3 }}>
            <View
              style={{
                width: size * 0.75,
                height: size * 0.26,
                borderRadius: 2,
                borderWidth: strokeWidth,
                borderColor: color,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 3,
                justifyContent: 'space-between',
              }}
            >
              <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
              <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
            </View>
            <View
              style={{
                width: size * 0.75,
                height: size * 0.26,
                borderRadius: 2,
                borderWidth: strokeWidth,
                borderColor: color,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 3,
                justifyContent: 'space-between',
              }}
            >
              <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
              <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
            </View>
          </View>
        </View>
      );
    }

    case 'cached': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.8, fontWeight: 'bold', lineHeight: size }}>↻</Text>
        </View>
      );
    }

    case 'cloud_sync':
    case 'sync_saved_locally': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.75, lineHeight: size }}>☁</Text>
        </View>
      );
    }

    case 'replay_10': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.55, fontWeight: 'bold' }}>↺10</Text>
        </View>
      );
    }

    case 'forward_10': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.55, fontWeight: 'bold' }}>↻10</Text>
        </View>
      );
    }

    case 'volume_up': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.75 }}>🔊</Text>
        </View>
      );
    }

    case 'fullscreen': {
      return (
        <View style={containerStyle}>
          <View style={{ width: size * 0.65, height: size * 0.55, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: 4, height: 4, borderTopWidth: strokeWidth, borderLeftWidth: strokeWidth, borderColor: color }} />
              <View style={{ width: 4, height: 4, borderTopWidth: strokeWidth, borderRightWidth: strokeWidth, borderColor: color }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ width: 4, height: 4, borderBottomWidth: strokeWidth, borderLeftWidth: strokeWidth, borderColor: color }} />
              <View style={{ width: 4, height: 4, borderBottomWidth: strokeWidth, borderRightWidth: strokeWidth, borderColor: color }} />
            </View>
          </View>
        </View>
      );
    }

    case 'offline_pin': {
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
            <Text style={{ color, fontSize: size * 0.45, fontWeight: 'bold' }}>✓</Text>
          </View>
        </View>
      );
    }

    default:
      return null;
  }
}
