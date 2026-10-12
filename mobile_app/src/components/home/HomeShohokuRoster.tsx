import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Character } from '../../types';
import { CharacterCard } from '../CharacterCard';
import { SHOHOKU_HEROES } from '../../constants/home-data';
import { styles } from './home.styles';

interface HomeShohokuRosterProps {
  characters?: Character[];
  onCharacterPress: () => void;
}

export const HomeShohokuRoster: React.FC<HomeShohokuRosterProps> = ({
  characters,
  onCharacterPress,
}) => {
  const roster = characters && characters.length > 0 ? characters : SHOHOKU_HEROES;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.titleBarAmber} />
          <Text style={styles.sectionTitle}>أبطال الصقور (Shohoku)</Text>
        </View>
        <View style={styles.badgeGoldPill}>
          <Text style={styles.badgeGoldText}>الخماسي الذهبي</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollList}
      >
        {roster.map((char) => (
          <CharacterCard
            key={char.id}
            character={char}
            onPress={onCharacterPress}
          />
        ))}
      </ScrollView>
    </View>
  );
};
