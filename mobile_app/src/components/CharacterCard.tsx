import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Character } from '../types';
import { THEME } from '../constants/theme';

interface CharacterCardProps {
  character: Character;
  onPress?: (char: Character) => void;
  width?: number;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onPress, width = 145 }) => {
  return (
    <TouchableOpacity
      style={[styles.container, { width }]}
      onPress={() => onPress && onPress(character)}
      activeOpacity={0.85}
    >
      <View style={styles.avatarWrap}>
        <Image
          source={{ uri: character.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLg6JNKL3cZxeOj-F7SW7gLj9x7iPVm4yGTw&s' }}
          style={styles.avatar}
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
        <Text style={styles.position} numberOfLines={1}>
          {character.position || character.role || 'لاعب شوهوكو'}
        </Text>
        <Text style={styles.team} numberOfLines={1}>
          {character.team || 'فريق الصقور'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginRight: THEME.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    position: 'relative',
    backgroundColor: THEME.colors.surface,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
    marginBottom: THEME.spacing.sm,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  numberBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: THEME.colors.background,
  },
  numberText: {
    color: THEME.colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  info: {
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.colors.white,
    textAlign: 'center',
  },
  position: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.colors.primaryLight,
    marginTop: 2,
    textAlign: 'center',
  },
  team: {
    fontSize: 9,
    color: THEME.colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
});
