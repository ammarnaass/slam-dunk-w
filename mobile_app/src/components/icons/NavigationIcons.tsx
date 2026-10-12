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

export function renderNavigationIcon(name: string, ctx: IconRenderContext): React.ReactNode | null {
  const { size, color, strokeWidth, filled, containerStyle } = ctx;

  switch (name) {
    case 'home': {
      const w = size * 0.75;
      const h = size * 0.48;
      return (
        <View style={containerStyle}>
          {/* Roof */}
          <View
            style={{
              width: w * 0.72,
              height: w * 0.72,
              borderTopWidth: strokeWidth,
              borderLeftWidth: strokeWidth,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
              marginBottom: -w * 0.36,
            }}
          />
          {/* House body */}
          <View
            style={{
              width: w,
              height: h,
              borderWidth: strokeWidth,
              borderTopWidth: 0,
              borderColor: color,
              borderBottomLeftRadius: 3,
              borderBottomRightRadius: 3,
              backgroundColor: filled ? color + '25' : 'transparent',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {/* Door */}
            <View
              style={{
                width: w * 0.36,
                height: h * 0.65,
                backgroundColor: color,
                borderTopLeftRadius: 2,
                borderTopRightRadius: 2,
              }}
            />
          </View>
        </View>
      );
    }

    case 'tv': {
      const screenW = size * 0.85;
      const screenH = size * 0.62;
      return (
        <View style={containerStyle}>
          {/* Stand / Antenna */}
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 1 }}>
            <View
              style={{
                width: strokeWidth,
                height: 4,
                backgroundColor: color,
                transform: [{ rotate: '-35deg' }],
                borderRadius: 1,
              }}
            />
            <View
              style={{
                width: strokeWidth,
                height: 4,
                backgroundColor: color,
                transform: [{ rotate: '35deg' }],
                borderRadius: 1,
              }}
            />
          </View>
          {/* TV Screen */}
          <View
            style={{
              width: screenW,
              height: screenH,
              borderRadius: 5,
              borderWidth: strokeWidth,
              borderColor: color,
              backgroundColor: filled ? color + '22' : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                width: screenW * 0.5,
                height: strokeWidth,
                backgroundColor: color,
                borderRadius: 1,
              }}
            />
          </View>
        </View>
      );
    }

    case 'movie': {
      const cardW = size * 0.85;
      const cardH = size * 0.7;
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: cardW,
              height: cardH,
              borderRadius: 4,
              borderWidth: strokeWidth,
              borderColor: color,
              overflow: 'hidden',
              backgroundColor: filled ? color + '22' : 'transparent',
            }}
          >
            <View
              style={{
                width: '100%',
                height: cardH * 0.35,
                backgroundColor: color,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: strokeWidth,
                  height: '100%',
                  backgroundColor: '#000',
                  transform: [{ rotate: '30deg' }],
                }}
              />
              <View
                style={{
                  width: strokeWidth,
                  height: '100%',
                  backgroundColor: '#000',
                  transform: [{ rotate: '30deg' }],
                }}
              />
              <View
                style={{
                  width: strokeWidth,
                  height: '100%',
                  backgroundColor: '#000',
                  transform: [{ rotate: '30deg' }],
                }}
              />
            </View>
          </View>
        </View>
      );
    }

    case 'user': {
      const headR = size * 0.22;
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: headR * 2,
              height: headR * 2,
              borderRadius: headR,
              borderWidth: strokeWidth,
              borderColor: color,
              backgroundColor: filled ? color : 'transparent',
              marginBottom: 2,
            }}
          />
          <View
            style={{
              width: size * 0.75,
              height: size * 0.35,
              borderTopLeftRadius: size * 0.38,
              borderTopRightRadius: size * 0.38,
              borderWidth: strokeWidth,
              borderBottomWidth: 0,
              borderColor: color,
              backgroundColor: filled ? color : 'transparent',
            }}
          />
        </View>
      );
    }

    case 'search': {
      const cSize = size * 0.52;
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: cSize,
              height: cSize,
              borderRadius: cSize / 2,
              borderWidth: strokeWidth,
              borderColor: color,
              marginBottom: 2,
              marginRight: 2,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: strokeWidth,
              height: size * 0.35,
              backgroundColor: color,
              borderRadius: 1,
              bottom: size * 0.12,
              right: size * 0.15,
              transform: [{ rotate: '-45deg' }],
            }}
          />
        </View>
      );
    }

    case 'chevronRight':
    case 'arrowRight':
    case 'arrow-right': {
      const arrowSize = size * 0.42;
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: arrowSize,
              height: arrowSize,
              borderTopWidth: strokeWidth,
              borderRightWidth: strokeWidth,
              borderColor: color,
              borderRadius: 1,
              transform: [{ rotate: '45deg' }],
              marginRight: 2,
            }}
          />
        </View>
      );
    }

    case 'chevronLeft':
    case 'arrowLeft': {
      const arrowSize = size * 0.42;
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: arrowSize,
              height: arrowSize,
              borderTopWidth: strokeWidth,
              borderLeftWidth: strokeWidth,
              borderColor: color,
              borderRadius: 1,
              transform: [{ rotate: '-45deg' }],
              marginLeft: 2,
            }}
          />
        </View>
      );
    }

    case 'arrow-up-down': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.75, fontWeight: '900' }}>⇅</Text>
        </View>
      );
    }

    case 'users': {
      return (
        <View style={[containerStyle, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
          <View style={{ alignItems: 'center', marginRight: -4, opacity: 0.7 }}>
            <View style={{ width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14, borderWidth: strokeWidth, borderColor: color }} />
            <View style={{ width: size * 0.45, height: size * 0.22, borderTopLeftRadius: size * 0.22, borderTopRightRadius: size * 0.22, borderWidth: strokeWidth, borderBottomWidth: 0, borderColor: color }} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: size * 0.35, height: size * 0.35, borderRadius: size * 0.175, borderWidth: strokeWidth, borderColor: color }} />
            <View style={{ width: size * 0.55, height: size * 0.28, borderTopLeftRadius: size * 0.28, borderTopRightRadius: size * 0.28, borderWidth: strokeWidth, borderBottomWidth: 0, borderColor: color }} />
          </View>
        </View>
      );
    }

    case 'more-vertical': {
      return (
        <View style={[containerStyle, { justifyContent: 'space-evenly', alignItems: 'center', paddingVertical: size * 0.15 }]}>
          <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
          <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
          <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
        </View>
      );
    }

    case 'compass': {
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
            <View
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: 3,
                borderRightWidth: 3,
                borderBottomWidth: size * 0.35,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: color,
                transform: [{ rotate: '45deg' }],
              }}
            />
          </View>
        </View>
      );
    }

    case 'arrow_forward':
    case 'arrow-forward': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.4,
              height: size * 0.4,
              borderTopWidth: strokeWidth + 0.5,
              borderRightWidth: strokeWidth + 0.5,
              borderColor: color,
              transform: [{ rotate: '45deg' }],
              marginLeft: -2,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: size * 0.55,
              height: strokeWidth,
              backgroundColor: color,
            }}
          />
        </View>
      );
    }

    case 'arrow_back': {
      return (
        <View style={containerStyle}>
          <View
            style={{
              width: size * 0.4,
              height: size * 0.4,
              borderTopWidth: strokeWidth + 0.5,
              borderLeftWidth: strokeWidth + 0.5,
              borderColor: color,
              transform: [{ rotate: '-45deg' }],
              marginRight: -2,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: size * 0.55,
              height: strokeWidth,
              backgroundColor: color,
            }}
          />
        </View>
      );
    }

    case 'person':
    case 'account_circle': {
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
              overflow: 'hidden',
              backgroundColor: filled ? color + '25' : 'transparent',
            }}
          >
            <View
              style={{
                width: size * 0.32,
                height: size * 0.32,
                borderRadius: (size * 0.32) / 2,
                borderWidth: strokeWidth,
                borderColor: color,
                marginTop: size * 0.08,
                backgroundColor: filled ? color : 'transparent',
              }}
            />
            <View
              style={{
                width: size * 0.6,
                height: size * 0.35,
                borderTopLeftRadius: size * 0.3,
                borderTopRightRadius: size * 0.3,
                borderWidth: strokeWidth,
                borderColor: color,
                marginTop: 2,
                backgroundColor: filled ? color : 'transparent',
              }}
            />
          </View>
        </View>
      );
    }

    case 'grid_view': {
      const boxSize = size * 0.32;
      return (
        <View style={containerStyle}>
          <View style={{ gap: 2 }}>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              <View style={{ width: boxSize, height: boxSize, borderRadius: 2, borderWidth: strokeWidth, borderColor: color }} />
              <View style={{ width: boxSize, height: boxSize, borderRadius: 2, borderWidth: strokeWidth, borderColor: color }} />
            </View>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              <View style={{ width: boxSize, height: boxSize, borderRadius: 2, borderWidth: strokeWidth, borderColor: color }} />
              <View style={{ width: boxSize, height: boxSize, borderRadius: 2, borderWidth: strokeWidth, borderColor: color }} />
            </View>
          </View>
        </View>
      );
    }

    case 'view_agenda': {
      return (
        <View style={containerStyle}>
          <View style={{ gap: 3 }}>
            <View style={{ width: size * 0.7, height: size * 0.28, borderRadius: 2, borderWidth: strokeWidth, borderColor: color }} />
            <View style={{ width: size * 0.7, height: size * 0.28, borderRadius: 2, borderWidth: strokeWidth, borderColor: color }} />
          </View>
        </View>
      );
    }

    case 'more_vert': {
      return (
        <View style={containerStyle}>
          <View style={{ gap: 3, alignItems: 'center' }}>
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
          </View>
        </View>
      );
    }

    case 'more_horiz': {
      return (
        <View style={containerStyle}>
          <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center' }}>
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
            <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
          </View>
        </View>
      );
    }

    case 'history': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.8, lineHeight: size }}>⏱</Text>
        </View>
      );
    }

    case 'explore': {
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
            <View
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: 3,
                borderRightWidth: 3,
                borderBottomWidth: size * 0.32,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: color,
                transform: [{ rotate: '45deg' }],
              }}
            />
          </View>
        </View>
      );
    }

    default:
      return null;
  }
}
