import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Character } from '../types';
import { THEME } from '../constants/theme';
import { fetchCharacters } from '../services/api';

const DEFAULT_CHARACTERS: Character[] = [
  {
    id: 'sakuragi',
    name: 'هاناميتشي ساكوراجي',
    name_ar: 'هاناميتشي ساكوراجي',
    name_en: 'Hanamichi Sakuragi',
    number: '10',
    position: 'مهاجم قوي (Power Forward)',
    team: 'شوهوكو (Shohoku)',
    role: 'البطل المبتدئ العبقري وملك المرتدات',
    description: 'طالب في السنة الأولى انضم لفريق السلة لإثارة إعجاب هاروكو، ليتحول إلى لاعب عبقري ومقاتل شرس على المرتدات.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLg6JNKL3cZxeOj-F7SW7gLj9x7iPVm4yGTw&s',
  },
  {
    id: 'rukawa',
    name: 'كايدي روكاوا',
    name_ar: 'كايدي روكاوا',
    name_en: 'Kaede Rukawa',
    number: '11',
    position: 'مهاجم صغير (Small Forward)',
    team: 'شوهوكو (Shohoku)',
    role: 'نجم الفريق والهداف الاستثنائي',
    description: 'اللاعب الأكثر مهارة وهدوءاً، يسعى لأن يصبح اللاعب رقم 1 في اليابان.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLg6JNKL3cZxeOj-F7SW7gLj9x7iPVm4yGTw&s',
  },
  {
    id: 'akagi',
    name: 'تاكينوري أكاجي',
    name_ar: 'تاكينوري أكاجي (الغوريلا)',
    name_en: 'Takenori Akagi',
    number: '4',
    position: 'لاعب وسط (Center)',
    team: 'شوهوكو (Shohoku)',
    role: 'قائد الفريق وحامي السلة',
    description: 'قائد شوهوكو وصخرة الدفاع، حلمه الأبدي قيادة الفريق نحو الفوز بالبطولة الوطنية.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLg6JNKL3cZxeOj-F7SW7gLj9x7iPVm4yGTw&s',
  },
  {
    id: 'mitsui',
    name: 'هيساشي ميتسوي',
    name_ar: 'هيساشي ميتسوي',
    name_en: 'Hisashi Mitsui',
    number: '14',
    position: 'مدافع مسدد (Shooting Guard)',
    team: 'شوهوكو (Shohoku)',
    role: 'سيد الثلاثيات القاتلة',
    description: 'أفضل مسدد ثلاثيات، كان أفضل لاعب في المرحلة المتوسطة وعاد لشغفه بعد فترة ضياع.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLg6JNKL3cZxeOj-F7SW7gLj9x7iPVm4yGTw&s',
  },
  {
    id: 'miyagi',
    name: 'ريوتا مياجي',
    name_ar: 'ريوتا مياجي',
    name_en: 'Ryota Miyagi',
    number: '7',
    position: 'صانع ألعاب (Point Guard)',
    team: 'شوهوكو (Shohoku)',
    role: 'برق شوهوكو وقائد الهجمات السريعة',
    description: 'صانع ألعاب فائق السرعة والمراوغة، يمتلك رؤية خارقة للملعب وتمريرات حاسمة.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLg6JNKL3cZxeOj-F7SW7gLj9x7iPVm4yGTw&s',
  },
];

export const CharactersScreen: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>(DEFAULT_CHARACTERS);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCharacters().then((data) => {
      if (data && data.length > 0) {
        setCharacters(data);
      }
    });
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <View style={styles.headerBox}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>🏀 بطولة المدارس الوطنية</Text>
        </View>
        <Text style={styles.headerTitle}>لاعبي وشخصيات سلام دانك</Text>
        <Text style={styles.headerSubtitle}>
          صقور شوهوكو والنجوم الأسطوريين الذين تنافسوا على زعامة كاناغاوا واليابان.
        </Text>
      </View>

      {/* Characters Cards List */}
      <View style={styles.list}>
        {characters.map((char) => (
          <View key={char.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatarWrap}>
                <Image
                  source={{ uri: char.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLg6JNKL3cZxeOj-F7SW7gLj9x7iPVm4yGTw&s' }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
                {char.number && (
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>#{char.number}</Text>
                  </View>
                )}
              </View>

              <View style={styles.titleArea}>
                <Text style={styles.charName}>{char.name_ar || char.name}</Text>
                {char.name_en && (
                  <Text style={styles.charEnName}>{char.name_en}</Text>
                )}
                <View style={styles.roleRow}>
                  <Text style={styles.charRole}>{char.role || char.position || 'لاعب'}</Text>
                </View>
              </View>
            </View>

            {char.description && (
              <Text style={styles.charDesc}>{char.description}</Text>
            )}

            <View style={styles.cardFooter}>
              <View style={styles.teamPill}>
                <Text style={styles.teamPillText}>{char.team || 'فريق شوهوكو'}</Text>
              </View>
              {char.position && (
                <View style={styles.positionPill}>
                  <Text style={styles.positionPillText}>{char.position}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    padding: THEME.spacing.lg,
  },
  headerBox: {
    padding: THEME.spacing.lg,
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.xl,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    marginBottom: THEME.spacing.xl,
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: THEME.colors.primaryLight,
    fontSize: 11,
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.colors.white,
    textAlign: 'right',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    textAlign: 'right',
    lineHeight: 18,
  },
  list: {
    paddingBottom: 40,
    gap: THEME.spacing.md,
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  avatarWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    position: 'relative',
    backgroundColor: THEME.colors.surface,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
  },
  numberBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: THEME.colors.card,
  },
  numberText: {
    color: THEME.colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  titleArea: {
    flex: 1,
    alignItems: 'flex-end',
  },
  charName: {
    fontSize: 16,
    fontWeight: '900',
    color: THEME.colors.white,
  },
  charEnName: {
    fontSize: 11,
    color: THEME.colors.textDim,
    marginTop: 1,
  },
  roleRow: {
    marginTop: 4,
  },
  charRole: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.primaryLight,
  },
  charDesc: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    textAlign: 'right',
    lineHeight: 18,
    marginTop: THEME.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: THEME.spacing.md,
    paddingTop: THEME.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  teamPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  teamPillText: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  positionPill: {
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  positionPillText: {
    color: THEME.colors.primaryLight,
    fontSize: 10,
    fontWeight: '700',
  },
});
