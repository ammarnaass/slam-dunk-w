import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';

export type IconName =
  | 'home'
  | 'tv'
  | 'movie'
  | 'user'
  | 'person'
  | 'account_circle'
  | 'basketball'
  | 'search'
  | 'play'
  | 'play_arrow'
  | 'pause'
  | 'flame'
  | 'local_fire_department'
  | 'star'
  | 'stars'
  | 'arrowLeft'
  | 'arrowRight'
  | 'arrow_forward'
  | 'arrow-forward'
  | 'arrow_back'
  | 'arrow-right'
  | 'chevronLeft'
  | 'chevronRight'
  | 'check'
  | 'close'
  | 'server'
  | 'dns'
  | 'filter'
  | 'tune'
  | 'sort'
  | 'sparkles'
  | 'settings'
  | 'download'
  | 'download_for_offline'
  | 'download-for-offline'
  | 'tool'
  | 'crown'
  | 'workspace_premium'
  | 'bell'
  | 'notifications'
  | 'clock'
  | 'schedule'
  | 'share'
  | 'bookmark'
  | 'bookmark_add'
  | 'bookmark-add'
  | 'bookmark_border'
  | 'heart'
  | 'favorite'
  | 'chat'
  | 'forum'
  | 'trash'
  | 'lock'
  | 'lock_open'
  | 'lock-open'
  | 'verified'
  | 'wifiOff'
  | 'radar'
  | 'shield-check'
  | 'film'
  | 'video_library'
  | 'video-library'
  | 'arrow-up-down'
  | 'swap_vert'
  | 'swap-vert'
  | 'users'
  | 'more-vertical'
  | 'more_vert'
  | 'more_horiz'
  | 'thumbs-up'
  | 'thumb_up'
  | 'reply'
  | 'compass'
  | 'explore'
  | 'play-circle'
  | 'mic'
  | 'zap'
  | 'bolt'
  | 'cloud_sync'
  | 'memory'
  | 'checklist'
  | 'grid_view'
  | 'view_agenda'
  | 'format_quote'
  | 'cached'
  | 'flag'
  | 'sentiment_satisfied'
  | 'replay_10'
  | 'forward_10'
  | 'volume_up'
  | 'fullscreen'
  | 'done_all'
  | 'history'
  | 'photo_camera'
  | 'calendar_month'
  | 'cleaning_services'
  | 'auto_delete'
  | 'sync_saved_locally'
  | 'offline_pin'
  | 'check_box'
  | 'check_box_outline_blank'
  | 'delete'
  | 'delete_sweep'
  | 'delete_forever'
  | 'check_circle'
  | 'sports_basketball'
  | 'search_insights'
  | 'swords'
  | 'translate';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 22,
  color = THEME.colors.text,
  strokeWidth = 2,
  filled = false,
}) => {
  const containerStyle = {
    width: size,
    height: size,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

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

    case 'download': {
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
            <Text style={{ color: THEME.colors.surface, fontSize: size * 0.28, fontWeight: '900', lineHeight: size * 0.32 }}>+</Text>
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

    case 'notifications': {
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

    case 'format_quote': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.9, fontWeight: '900', lineHeight: size * 0.9 }}>“</Text>
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

    case 'thumb_up': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.75, lineHeight: size }}>👍</Text>
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

    case 'cloud_sync':
    case 'sync_saved_locally': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.75, lineHeight: size }}>☁</Text>
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

    case 'history': {
      return (
        <View style={containerStyle}>
          <Text style={{ color, fontSize: size * 0.8, lineHeight: size }}>⏱</Text>
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

    default:
      return null;
  }
};
