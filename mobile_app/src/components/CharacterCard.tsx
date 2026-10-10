import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Character } from '../types';
import { THEME } from '../constants/theme';

interface CharacterCardProps {
  character: Character;
  onPress?: (char: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(character)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: character.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLg6JNKL3cZxeOj-F7SW7gLj9x7iPVm4yGTw&s' }}
          style={styles.image}
          resizeMode="cover"
        />
        {character.number && (
          <View style={styles.numberBadge}>
            <Text style={styles.numberText}>#{character.number}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {character.name_ar || character.name}
        </Text>
        <Text style={styles.role} numberOfLines={1}>
          {character.role || character.position || 'لاعب شوهوكو'}
        </Text>
        {character.team && (
          <View style={styles.teamTag}>
            <Text style={styles.teamText}>{character.team}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginRight: THEME.spacing.md,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: THEME.colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  numberBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: THEME.radius.sm,
  },
  numberText: {
    color: THEME.colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  info: {
    padding: THEME.spacing.sm,
    alignItems: 'center',
  },
  name: {
    color: THEME.colors.white,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  role: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  teamTag: {
    marginTop: 6,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: THEME.radius.sm,
  },
  teamText: {
    color: THEME.colors.orange,
    fontSize: 9,
    fontWeight: 'bold',
  },
});
