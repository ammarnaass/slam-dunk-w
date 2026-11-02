import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { Icon } from '../../../components/Icon';
import { EpisodesDrawerProps } from '../types/player.types';
import { drawerStyles } from '../styles/drawer.styles';

export const MXEpisodesDrawer: React.FC<EpisodesDrawerProps> = ({
  visible,
  episodes,
  currentEpisodeId,
  onSelectEpisode,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <View style={drawerStyles.modalContainer}>
      <Pressable style={drawerStyles.backdrop} onPress={onClose} />

      <View style={drawerStyles.drawerContent}>
        <View style={drawerStyles.drawerHeader}>
          <TouchableOpacity style={drawerStyles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Icon name="close" size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={drawerStyles.drawerTitle}>قائمة حلقات سلام دانك (101)</Text>
        </View>

        <FlatList
          data={episodes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={drawerStyles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isActive = item.id === currentEpisodeId;
            return (
              <TouchableOpacity
                style={[drawerStyles.episodeItem, isActive && drawerStyles.episodeItemActive]}
                onPress={() => {
                  onSelectEpisode(item);
                  onClose();
                }}
                activeOpacity={0.75}
              >
                <View style={drawerStyles.episodeTextContainer}>
                  <Text
                    style={[drawerStyles.episodeTitle, isActive && drawerStyles.episodeTitleActive]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text style={drawerStyles.episodeDuration}>
                    المدة: {item.duration || '23:30'} • دقة 1080p
                  </Text>
                </View>

                <View style={[drawerStyles.episodeNumberBadge, isActive && drawerStyles.badgeActive]}>
                  <Text style={[drawerStyles.episodeNumberText, isActive && drawerStyles.badgeTextActive]}>
                    #{item.episode_number || item.episodeNumber || item.id}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};
