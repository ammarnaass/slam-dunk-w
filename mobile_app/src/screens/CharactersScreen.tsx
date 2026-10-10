import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Character } from '../types';
import { THEME } from '../constants/theme';

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
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>فريق مدرسة شوهوكو لكرة السلة</Text>
        <Text style={styles.headerSubtitle}>
          الخماسي الأسطوري الذي تحدى أقوى فرق كاناغاوا واليابان
        </Text>
      </View>

      <View style={styles.list}>
        {DEFAULT_CHARACTERS.map((char) => (
          <View key={char.id} style={styles.card}>
            <Image source={{ uri: char.image }} style={styles.avatar} />
            <View style={styles.details}>
              <View style={styles.titleRow}>
                <View style={styles.numBadge}>
                  <Text style={styles.numText}>#{char.number}</Text>
                </View>
                <Text style={styles.name}>{char.name_ar}</Text>
              </View>
              <Text style={styles.position}>{char.position}</Text>
              <Text style={styles.role}>{char.role}</Text>
              <Text style={styles.desc} numberOfLines={3}>
                {char.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  headerBox: {
    padding: THEME.spacing.lg,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.cardBorder,
  },
  headerTitle: {
    color: THEME.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  headerSubtitle: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  list: {
    padding: THEME.spacing.lg,
    gap: THEME.spacing.md,
  },
  card: {
    backgroundColor: THEME.colors.card,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    flexDirection: 'row-reverse',
    gap: THEME.spacing.md,
  },
  avatar: {
    width: 90,
    height: 110,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surface,
  },
  details: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  name: {
    color: THEME.colors.white,
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  numBadge: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: THEME.radius.sm,
  },
  numText: {
    color: THEME.colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  position: {
    color: THEME.colors.orange,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'right',
  },
  role: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'right',
  },
  desc: {
    color: THEME.colors.textDim,
    fontSize: 11,
    marginTop: 6,
    lineHeight: 16,
    textAlign: 'right',
  },
});
