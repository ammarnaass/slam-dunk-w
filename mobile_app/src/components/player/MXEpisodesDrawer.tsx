import React from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Icon } from '../Icon';
import { Episode } from '../../types';
import { THEME } from '../../constants/theme';

interface MXEpisodesDrawerProps {
  visible: boolean;
  episodes: Episode[];
  currentEpisodeId: string;
  onSelectEpisode: (episode: Episode) => void;
  onClose: () => void;
}

export const MXEpisodesDrawer: React.FC<MXEpisodesDrawerProps> = ({
  visible,
  episodes,
  currentEpisodeId,
  onSelectEpisode,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      {/* Transparent backdrop to dismiss */}
      <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Sliding Sheet */}
        <View style={styles.drawerContent}>
          <View style={styles.drawerHeader}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Icon name="close" size={20} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.drawerTitle}>قائمة حلقات سلام دانك (101)</Text>
          </View>

          <FlatList
            data={episodes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isActive = item.id === currentEpisodeId;
              return (
                <TouchableOpacity
                  style={[styles.episodeItem, isActive && styles.episodeItemActive]}
                  onPress={() => {
                    onSelectEpisode(item);
                    onClose();
                  }}
                  activeOpacity={0.75}
                >
                  <View style={styles.episodeTextContainer}>
                    <Text
                      style={[styles.episodeTitle, isActive && styles.episodeTitleActive]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.episodeDuration}>
                      المدة: {item.duration || '23:30'} • دقة 1080p
                    </Text>
                  </View>

                  <View style={[styles.episodeNumberBadge, isActive && styles.badgeActive]}>
                    <Text style={[styles.episodeNumberText, isActive && styles.badgeTextActive]}>
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

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    zIndex: 1200,
    elevation: 40,
  },
  backdrop: {
    flex: 1,
  },
  drawerContent: {
    width: '78%',
    maxWidth: 360,
    backgroundColor: '#0F172A',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 44,
    paddingBottom: 36,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 12,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  episodeItemActive: {
    backgroundColor: 'rgba(230, 57, 70, 0.15)',
    borderColor: '#E63946',
  },
  episodeTextContainer: {
    flex: 1,
    marginRight: 10,
    alignItems: 'flex-end',
  },
  episodeTitle: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  episodeTitleActive: {
    color: '#FF6B00',
  },
  episodeDuration: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  episodeNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeActive: {
    backgroundColor: '#E63946',
  },
  episodeNumberText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: 'bold',
  },
  badgeTextActive: {
    color: '#FFF',
  },
});
