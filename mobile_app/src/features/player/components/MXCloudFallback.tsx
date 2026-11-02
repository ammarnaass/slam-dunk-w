import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Share } from 'react-native';
import { Icon } from '../../../components/Icon';
import { Episode } from '../../../types';
import { playerStyles } from '../styles/player.styles';

interface MXCloudFallbackProps {
  episode: Episode;
  serverName: string;
  videoUrl: string;
  onUseDemoStream: () => void;
}

export const MXCloudFallback: React.FC<MXCloudFallbackProps> = ({
  episode,
  serverName,
  videoUrl,
  onUseDemoStream,
}) => {
  const handleOpenExternal = () => {
    Alert.alert(
      '🎬 خيارات تشغيل الحلقة',
      `سيرفر: ${serverName}\nالجودة: 1080p FHD\nاختر الإجراء المناسب:`,
      [
        {
          text: '🚀 فتح في تطبيق MEGA / المتصفح',
          onPress: () => {
            Share.share({
              title: `مشاهدة ${episode.title}`,
              message: videoUrl,
              url: videoUrl,
            });
          },
        },
        {
          text: '⚡ تجربة مشغل MX Player على فيديو تجريبي',
          onPress: onUseDemoStream,
        },
        { text: 'إلغاء', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={playerStyles.cloudPosterContainer}>
      <Image
        source={{ uri: episode.thumbnail || '/logoep.jpg' }}
        style={playerStyles.cloudPosterImage}
        resizeMode="cover"
      />
      <View style={playerStyles.cloudPosterScrim}>
        <View style={playerStyles.cloudBadge}>
          <Text style={playerStyles.cloudBadgeText}>سيرفر سحابي مشفر: {serverName}</Text>
        </View>
        <Text style={playerStyles.cloudTitle}>{episode.title}</Text>
        <Text style={playerStyles.cloudSubtitle}>
          يدعم مشغل MX Player البث المباشر (Direct Stream). للتشغيل الفوري:
        </Text>

        <View style={playerStyles.cloudButtonsRow}>
          <TouchableOpacity
            style={playerStyles.cloudPrimaryBtn}
            onPress={handleOpenExternal}
            activeOpacity={0.85}
          >
            <Icon name="rocket_launch" size={20} color="#FFF" />
            <Text style={playerStyles.cloudBtnText}>تشغيل عبر تطبيق MEGA / المتصفح</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={playerStyles.cloudSecondaryBtn}
            onPress={onUseDemoStream}
            activeOpacity={0.85}
          >
            <Icon name="play" size={18} color="#FF6B00" />
            <Text style={playerStyles.cloudSecondaryBtnText}>
              تجربة إيماءات MX Player على بث مباشر
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
