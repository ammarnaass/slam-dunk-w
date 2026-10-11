import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { THEME } from '../constants/theme';
import { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  onPress?: (character: Character) => void;
  width?: number;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onPress,
  width = 112,
}) => {
  const name = character.name_ar || character.name;
  const jerseyNum = character.number || '';
  const position = character.position || character.role || 'لاعب';
  const nickname = character.description || 'بطل الصقور';

  return (
    <TouchableOpacity
      style={[styles.container, { width }]}
      onPress={() => onPress?.(character)}
      activeOpacity={0.8}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      {/* Circle Avatar with jersey number band */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatarCircle}>
          {character.image ? (
            <Image
              source={{ uri: character.image }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.placeholderText}>{name?.charAt(0) || '؟'}</Text>
            </View>
          )}

          {jerseyNum ? (
            <View style={styles.jerseyBand}>
              <Text style={styles.jerseyText}>#{jerseyNum}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Name */}
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      {/* Position */}
      <Text style={styles.position} numberOfLines={1}>
        {position}
      </Text>

      {/* Nickname / Badge */}
      <View style={styles.badgePill}>
        <Text style={styles.badgeText} numberOfLines={1}>
          {nickname}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.lg,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 4,
    gap: 3,
  },
  avatarWrapper: {
    marginBottom: 4,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceContainerHigh,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...THEME.typography.headlineMd,
    color: THEME.colors.onSurfaceVariant,
  },
  jerseyBand: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(220, 38, 38, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 1,
  },
  jerseyText: {
    color: THEME.colors.white,
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 11,
  },
  name: {
    ...THEME.typography.titleMd,
    fontSize: 15,
    color: THEME.colors.onSurface,
    textAlign: 'center',
    width: '100%',
  },
  position: {
    ...THEME.typography.labelSm,
    fontSize: 11,
    color: THEME.colors.primaryContainer,
    textAlign: 'center',
    width: '100%',
  },
  badgePill: {
    marginTop: 3,
    width: '100%',
    backgroundColor: THEME.colors.surfaceContainerHigh,
    borderRadius: THEME.radius.sm,
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignItems: 'center',
  },
  badgeText: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
