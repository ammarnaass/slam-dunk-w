import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Anime } from '../types';
import { THEME } from '../constants/theme';

interface AnimeCardProps {
  anime: Anime;
  onPress: (anime: Anime) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(anime)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: anime.coverImage || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTxpjOV_-f3YQQLUb_T_57HXpyZ4NIlMatMg&s' }}
          style={styles.image}
          resizeMode="cover"
        />
        {anime.type && (
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{anime.type}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {anime.title}
        </Text>
        <View style={styles.metaRow}>
          {anime.releaseYear && (
            <Text style={styles.metaText}>📅 {anime.releaseYear}</Text>
          )}
          {anime.totalEpisodes && (
            <Text style={styles.metaText}>🎬 {anime.totalEpisodes} حلقة</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginRight: THEME.spacing.md,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 2 / 3,
    position: 'relative',
    backgroundColor: THEME.colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radius.sm,
  },
  typeText: {
    color: THEME.colors.white,
    fontSize: 9,
    fontWeight: 'bold',
  },
  info: {
    padding: THEME.spacing.sm,
  },
  title: {
    color: THEME.colors.white,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  metaText: {
    color: THEME.colors.textDim,
    fontSize: 10,
  },
});
