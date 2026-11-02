import React from 'react';
import { View, Text, TouchableOpacity, Alert, Linking, Share } from 'react-native';
import { Icon } from '../../../components/Icon';
import { ServerOption } from '../types/watch.types';
import { modalStyles } from '../styles/modal.styles';

interface WatchPrimaryActionsProps {
  activeServer: ServerOption;
  episodeTitle: string;
  onOpenMXPlayer: () => void;
}

export const WatchPrimaryActions: React.FC<WatchPrimaryActionsProps> = ({
  activeServer,
  episodeTitle,
  onOpenMXPlayer,
}) => {
  const handleOpenDirectStream = () => {
    Alert.alert(
      '🎬 تشغيل الحلقة',
      `سيرفر: ${activeServer.name || 'سيرفر ميجا السريع'}\nالجودة: 1080p FHD\n\nاختر طريقة المشاهدة المفضلة:`,
      [
        {
          text: '🚀 فتح في تطبيق MEGA / المتصفح',
          onPress: async () => {
            if (!activeServer.url) return;
            try {
              await Linking.openURL(activeServer.url);
            } catch (_) {
              Alert.alert('تنبيه', 'لم يتم العثور على متصفح أو تطبيق متوافق على هذا الجهاز.');
            }
          },
        },
        {
          text: '📋 نسخ / مشاركة الرابط',
          onPress: () => {
            if (!activeServer.url) return;
            Share.share({
              title: `مشاهدة ${episodeTitle}`,
              message: activeServer.url,
              url: activeServer.url,
            });
          },
        },
        { text: 'إلغاء', style: 'cancel' },
      ]
    );
  };

  return (
    <>
      <View style={modalStyles.primaryActionContainer}>
        <TouchableOpacity
          style={modalStyles.mxPlayerBtn}
          onPress={onOpenMXPlayer}
          activeOpacity={0.88}
        >
          <Icon name="play" size={22} color="#FFFFFF" />
          <Text style={modalStyles.mxPlayerBtnText}>
            🎬 تشغيل بمشغل MX Player (إيماءات + صوت + سطوع)
          </Text>
        </TouchableOpacity>
      </View>

      {activeServer?.url ? (
        <View style={modalStyles.primaryActionContainer}>
          <TouchableOpacity
            style={modalStyles.startWatchingBtn}
            onPress={handleOpenDirectStream}
            activeOpacity={0.88}
          >
            <Icon name="rocket_launch" size={20} color="#FFFFFF" />
            <Text style={modalStyles.startWatchingText}>
              تشغيل الحلقة الآن ({activeServer.name || 'سيرفر ميجا السريع'})
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};
