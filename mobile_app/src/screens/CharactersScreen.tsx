import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Character } from '../types';
import { THEME } from '../constants/theme';
import { Icon } from '../components/Icon';
import { CharacterCard } from '../components/CharacterCard';
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
    description:
      'طالب في السنة الأولى انضم لفريق السلة لإثارة إعجاب هاروكو، ليتحول إلى مقاتل شرس وسيد الكرات المرتدة تحت السلة، صاحب العزيمة التي لا تلين.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuARaixDwClMBk8VjPmR1Q2rUIzdPzwaLu2UN88LAaneAT68-Dt1lyWDu-0gkKtii62D2siPahcfHX4SFVz3C3ign3Ab0TRwZXQSb7CIPBeuWZDXQrKYufhHb07FXgObV8byTeeQEjhmD0JGOHPuJ6crdhM7akhITM1MepDnWa_wDBnvnNco4IYOGt659sF1WSCFyKDMcDNWPrC9fEF1R_xhCvvamv9DhG2ws40iHFKDLtDpbhs8NwJP',
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
    description:
      'اللاعب الأكثر مهارة وهدوءاً وتركيزاً في كاناغاوا، يسعى لأن يصبح اللاعب رقم 1 في اليابان من خلال التدريب الشاق والروح التنافسية العالية.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFCBkEUZo8xV4WIupmc5uNpKqdnyHvRtXxO9kMzYTpVkAux1wiez5BMTP4wHyZzuwwVZOg_wpgku3f7SnzUPb-4AGdqIsO36pWFPLcHgbVL64MitADw-y54oNHCZX-4R68Oz9JjSkUHPj2bxQcK1UB22KBS5LnDGWFtCTle9at7MijbCu1PebjShS7NLnq718Qqm3TY2AhyBuHK0i-Pu5wO9kEtxsnSQlwrIRAINlXkAbGKHpT3o3v',
  },
  {
    id: 'akagi',
    name: 'تاكينوري أكاجي',
    name_ar: 'تاكينوري أكاجي (الغوريلا)',
    name_en: 'Takenori Akagi',
    number: '4',
    position: 'لاعب وسط (Center)',
    team: 'شوهوكو (Shohoku)',
    role: 'قائد الفريق وحامي عرين السلة',
    description:
      'قائد فريق شوهوكو وصخرة الدفاع، حلمه الأبدي منذ طفولته قيادة الفريق نحو الفوز بالبطولة الوطنية للمدارس الثانوية.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmq2nceLUBxfoOJqYBIc68pDPpefSLxVY7M152CuX1IFOvAxGj2Rpzxp5F0gSr9Y-BCCe6usdJzndy7g6LaB-KJ-OxcCkIZlzk3STd-PC5P66C7xc8q6jnEjHoVG329FisGcXuAgmQrr3_GIOV33yYYRqCVtaAfyqBqZo5cPhodjoVnHmyLZe0S9_WXU_A9aFSXfY6j_doWh4QTJJsde1fCHFuQxJN7NBNo5kvNQnkZOAusJIra160',
  },
  {
    id: 'mitsui',
    name: 'هيساشي ميتسوي',
    name_ar: 'هيساشي ميتسوي',
    name_en: 'Hisashi Mitsui',
    number: '14',
    position: 'مدافع مسدد (Shooting Guard)',
    team: 'شوهوكو (Shohoku)',
    role: 'سيد الثلاثيات القاتلة والقلب الشجاع',
    description:
      'أفضل مسدد ثلاثيات، كان أفضل لاعب في المرحلة المتوسطة وعاد لشغفه بعد فترة انقطاع ليكون السلاح القاتل لشوهوكو في أصعب اللحظات.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCcbCgbaCJ9Sjdse8Sovo5oYwivK5IwbP3-fNT2SFPG2lkLO0zm8Lg-BPLh15TVyG6OvfXxWmusccsHAVs2ZooJfdBy3n7dX7zQO70Baxlc3k2MM_37ytExM4q9jMncv-DA_lvpb9sOa8hcvBxE7_yuFx_nwPRI2-iADoyaJbkHI5MppnFDy_HF6OG6C5_NCZqpCI9J2zznZAp9g8llwP2Mxd046yXnBEK24Orhl65gcQ9Shn2EQ3Rk',
  },
  {
    id: 'miyagi',
    name: 'ريوتا مياجي',
    name_ar: 'ريوتا مياجي',
    name_en: 'Ryota Miyagi',
    number: '7',
    position: 'صانع ألعاب (Point Guard)',
    team: 'شوهوكو (Shohoku)',
    role: 'برق شوهوكو وقائد الهجمات المرتدة',
    description:
      'صانع ألعاب فائق السرعة والمراوغة، يمتلك رؤية خارقة للملعب وتمريرات حاسمة تربك أقوى دفاعات الخصوم.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWgp8np84cU1pXiGfgFONwPbOudYl8mTLiLB82xpMXlPaKPJE-OGVma0ZRcVdaBQPZvdKb_6Uo2gyoTSfUHPOxkO6gdZMGsXK-EIu7ynMnfDwHUw0-CFJgdyTvg3-nMZf1dGTZh20_O9O7fw-nPNJpQbD3NwHGgwyl67y3yKr2OhcKeQtL5lruF0W1xxWpgohfZJn9Y5p5l-xGTpA47CxeaPX4_OaPUHtC4d43WCUOgEVLS3eCu1QT',
  },
];

interface CharactersScreenProps {
  onBack?: () => void;
}

export const CharactersScreen: React.FC<CharactersScreenProps> = ({ onBack }) => {
  const [characters, setCharacters] = useState<Character[]>(DEFAULT_CHARACTERS);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [activeModalChar, setActiveModalChar] = useState<Character | null>(null);

  useEffect(() => {
    fetchCharacters().then((data) => {
      if (data && data.length > 0) {
        setCharacters(data);
      }
    });
  }, []);

  const teams = [
    { key: 'all', label: 'الكل' },
    { key: 'shohoku', label: 'صقور شوهوكو' },
    { key: 'ryonan', label: 'ريونان' },
    { key: 'kainan', label: 'كاينان' },
  ];

  const filteredCharacters = useMemo(() => {
    if (selectedTeam === 'all') return characters;
    return characters.filter((c) => {
      const teamStr = (c.team || '').toLowerCase();
      if (selectedTeam === 'shohoku') return teamStr.includes('شوهوكو') || teamStr.includes('shohoku');
      if (selectedTeam === 'ryonan') return teamStr.includes('ريونان') || teamStr.includes('ryonan');
      if (selectedTeam === 'kainan') return teamStr.includes('كاينان') || teamStr.includes('kainan');
      return true;
    });
  }, [characters, selectedTeam]);

  return (
    <View style={styles.rootContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Action Bar */}
        <View style={styles.headerBar}>
          {onBack && (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backBtn}
              activeOpacity={0.8}
              accessibilityLabel="رجوع"
            >
              <Icon name="arrow_forward" size={20} color={THEME.colors.onSurface} />
            </TouchableOpacity>
          )}
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>أبطال وشخصيات سلام دانك</Text>
            <Text style={styles.headerSub}>نجوم كاناغاوا والبطولة الوطنية</Text>
          </View>
        </View>

        {/* Hero Showcase Card */}
        <View style={styles.heroBanner}>
          <View style={styles.badgeRow}>
            <Icon name="sports_basketball" size={14} color={THEME.colors.primaryContainer} />
            <Text style={styles.badgeText}>صقور كاناغاوا الذهبية</Text>
          </View>
          <Text style={styles.heroMainTitle}>أساطير كرة السلة</Text>
          <Text style={styles.heroDesc}>
            تعرف على تفاصيل لاعبي شوهوكو ومنافسيهم، الأرقام المميزة والمراكز وأسرار عزيمتهم التي أدهشت الجميع.
          </Text>
        </View>

        {/* Team Filter Tabs */}
        <View style={styles.filterPillsRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsList}
          >
            {teams.map((t) => {
              const isSelected = selectedTeam === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.teamPill, isSelected && styles.teamPillActive]}
                  onPress={() => setSelectedTeam(t.key)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.teamPillText,
                      isSelected && styles.teamPillTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Circular Highlights Carousel */}
        <View style={styles.carouselSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>أبرز النجوم</Text>
            <Text style={styles.sectionSubtitle}>انقر على أي شخصية لعرض بطاقتها</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselList}
          >
            {characters.slice(0, 5).map((char) => (
              <CharacterCard
                key={`highlight-${char.id}`}
                character={char}
                width={104}
                onPress={() => setActiveModalChar(char)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Detailed Characters List */}
        <View style={styles.detailedSection}>
          <Text style={styles.detailedSectionTitle}>بطاقات اللاعبين الكاملة</Text>

          <View style={styles.cardsGrid}>
            {filteredCharacters.map((char) => (
              <TouchableOpacity
                key={char.id}
                style={styles.charDetailCard}
                onPress={() => setActiveModalChar(char)}
                activeOpacity={0.85}
              >
                <View style={styles.charCardHeader}>
                  <View style={styles.charAvatarWrap}>
                    <Image
                      source={{
                        uri:
                          char.image ||
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuARaixDwClMBk8VjPmR1Q2rUIzdPzwaLu2UN88LAaneAT68-Dt1lyWDu-0gkKtii62D2siPahcfHX4SFVz3C3ign3Ab0TRwZXQSb7CIPBeuWZDXQrKYufhHb07FXgObV8byTeeQEjhmD0JGOHPuJ6crdhM7akhITM1MepDnWa_wDBnvnNco4IYOGt659sF1WSCFyKDMcDNWPrC9fEF1R_xhCvvamv9DhG2ws40iHFKDLtDpbhs8NwJP',
                      }}
                      style={styles.charAvatar}
                      resizeMode="cover"
                    />
                    {char.number ? (
                      <View style={styles.charJerseyBadge}>
                        <Text style={styles.charJerseyText}>#{char.number}</Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.charHeaderInfo}>
                    <Text style={styles.charNameText}>{char.name_ar || char.name}</Text>
                    {char.name_en ? (
                      <Text style={styles.charEnNameText}>{char.name_en}</Text>
                    ) : null}
                    <View style={styles.roleTag}>
                      <Text style={styles.roleTagText}>{char.role || char.position || 'لاعب'}</Text>
                    </View>
                  </View>
                </View>

                {char.description ? (
                  <Text style={styles.charDescText} numberOfLines={3}>
                    {char.description}
                  </Text>
                ) : null}

                <View style={styles.charFooter}>
                  <View style={styles.teamBadge}>
                    <Text style={styles.teamBadgeText}>{char.team || 'فريق شوهوكو'}</Text>
                  </View>

                  {char.position ? (
                    <View style={styles.posBadge}>
                      <Text style={styles.posBadgeText}>{char.position}</Text>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* CHARACTER MODAL VIEW */}
      {activeModalChar && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setActiveModalChar(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setActiveModalChar(null)}
                activeOpacity={0.7}
              >
                <Icon name="close" size={18} color={THEME.colors.onSurface} />
              </TouchableOpacity>

              <View style={styles.modalAvatarLargeWrap}>
                <Image
                  source={{
                    uri:
                      activeModalChar.image ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuARaixDwClMBk8VjPmR1Q2rUIzdPzwaLu2UN88LAaneAT68-Dt1lyWDu-0gkKtii62D2siPahcfHX4SFVz3C3ign3Ab0TRwZXQSb7CIPBeuWZDXQrKYufhHb07FXgObV8byTeeQEjhmD0JGOHPuJ6crdhM7akhITM1MepDnWa_wDBnvnNco4IYOGt659sF1WSCFyKDMcDNWPrC9fEF1R_xhCvvamv9DhG2ws40iHFKDLtDpbhs8NwJP',
                  }}
                  style={styles.modalAvatarLarge}
                  resizeMode="cover"
                />
                {activeModalChar.number ? (
                  <View style={styles.modalJerseyLarge}>
                    <Text style={styles.modalJerseyLargeText}>
                      #{activeModalChar.number}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.modalName}>
                {activeModalChar.name_ar || activeModalChar.name}
              </Text>
              {activeModalChar.name_en ? (
                <Text style={styles.modalEnName}>{activeModalChar.name_en}</Text>
              ) : null}

              <View style={styles.modalBadgesRow}>
                <View style={styles.modalTeamPill}>
                  <Text style={styles.modalTeamPillText}>
                    {activeModalChar.team || 'فريق شوهوكو'}
                  </Text>
                </View>
                <View style={styles.modalPosPill}>
                  <Text style={styles.modalPosPillText}>
                    {activeModalChar.position || 'لاعب'}
                  </Text>
                </View>
              </View>

              <Text style={styles.modalRole}>
                {activeModalChar.role || 'نجم الفريق'}
              </Text>

              <Text style={styles.modalDesc}>
                {activeModalChar.description ||
                  'أحد أبرز نجوم كرة السلة في كاناغاوا، يتميز بالمهارة العالية والعزيمة الاستثنائية.'}
              </Text>

              <TouchableOpacity
                style={styles.modalActionBtn}
                onPress={() => setActiveModalChar(null)}
                activeOpacity={0.85}
              >
                <Text style={styles.modalActionBtnText}>إغلاق البطاقة</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: THEME.spacing.spaceSm,
    paddingHorizontal: THEME.spacing.margin,
    paddingTop: THEME.spacing.spaceSm,
    paddingBottom: THEME.spacing.spaceXs,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: THEME.radius.lg,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
  },
  headerSub: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
    marginTop: 2,
  },

  /* HERO BANNER */
  heroBanner: {
    marginHorizontal: THEME.spacing.margin,
    marginTop: THEME.spacing.spaceSm,
    marginBottom: THEME.spacing.spaceMd,
    padding: THEME.spacing.spaceMd,
    borderRadius: THEME.radius.xl,
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'flex-end',
    gap: 6,
  },
  badgeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(220, 38, 38, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.DEFAULT,
  },
  badgeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  heroMainTitle: {
    ...THEME.typography.headlineMd,
    color: THEME.colors.onSurface,
  },
  heroDesc: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'right',
    lineHeight: 18,
  },

  /* TEAM FILTER */
  filterPillsRow: {
    marginBottom: THEME.spacing.spaceMd,
  },
  filterPillsList: {
    paddingHorizontal: THEME.spacing.margin,
    flexDirection: 'row-reverse',
    gap: 8,
  },
  teamPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  teamPillActive: {
    backgroundColor: THEME.colors.primaryContainer,
    borderColor: THEME.colors.primaryContainer,
  },
  teamPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  teamPillTextActive: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },

  /* CAROUSEL */
  carouselSection: {
    marginBottom: THEME.spacing.spaceLg,
  },
  sectionHeader: {
    paddingHorizontal: THEME.spacing.margin,
    marginBottom: THEME.spacing.spaceSm,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
  },
  sectionSubtitle: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  carouselList: {
    paddingHorizontal: THEME.spacing.margin,
    flexDirection: 'row-reverse',
    gap: 12,
  },

  /* DETAILED SECTION */
  detailedSection: {
    paddingHorizontal: THEME.spacing.margin,
    gap: THEME.spacing.spaceSm,
  },
  detailedSectionTitle: {
    ...THEME.typography.titleMd,
    color: THEME.colors.onSurface,
    textAlign: 'right',
  },
  cardsGrid: {
    gap: 12,
  },
  charDetailCard: {
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.xl,
    padding: THEME.spacing.spaceMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 10,
  },
  charCardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
  },
  charAvatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    position: 'relative',
    backgroundColor: THEME.colors.surfaceContainerLowest,
    borderWidth: 2,
    borderColor: THEME.colors.primaryContainer,
  },
  charAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  charJerseyBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: THEME.colors.surfaceContainer,
  },
  charJerseyText: {
    color: THEME.colors.onPrimaryContainer,
    fontSize: 9,
    fontWeight: '900',
  },
  charHeaderInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  charNameText: {
    ...THEME.typography.bodyLg,
    fontWeight: '700',
    color: THEME.colors.onSurface,
  },
  charEnNameText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginTop: 1,
  },
  roleTag: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  roleTagText: {
    ...THEME.typography.labelSm,
    fontSize: 10,
    color: THEME.colors.primary,
    fontWeight: '700',
  },
  charDescText: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'right',
    lineHeight: 18,
  },
  charFooter: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 8,
  },
  teamBadge: {
    backgroundColor: 'rgba(238, 152, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  teamBadgeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  posBadge: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  posBadgeText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 14, 22, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: THEME.colors.surfaceContainer,
    borderRadius: THEME.radius.xl,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAvatarLargeWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: THEME.colors.primaryContainer,
    position: 'relative',
    marginBottom: 14,
  },
  modalAvatarLarge: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
  },
  modalJerseyLarge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: THEME.colors.surfaceContainer,
  },
  modalJerseyLargeText: {
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '900',
    fontSize: 12,
  },
  modalName: {
    ...THEME.typography.headlineSm,
    color: THEME.colors.onSurface,
    textAlign: 'center',
  },
  modalEnName: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  modalBadgesRow: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginBottom: 10,
  },
  modalTeamPill: {
    backgroundColor: 'rgba(238, 152, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.DEFAULT,
  },
  modalTeamPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.secondary,
    fontWeight: '700',
  },
  modalPosPill: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.DEFAULT,
  },
  modalPosPillText: {
    ...THEME.typography.labelSm,
    color: THEME.colors.onSurfaceVariant,
  },
  modalRole: {
    ...THEME.typography.labelMd,
    color: THEME.colors.primary,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalDesc: {
    ...THEME.typography.bodySm,
    color: THEME.colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalActionBtn: {
    backgroundColor: THEME.colors.primaryContainer,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: THEME.radius.lg,
    width: '100%',
    alignItems: 'center',
  },
  modalActionBtnText: {
    ...THEME.typography.labelMd,
    color: THEME.colors.onPrimaryContainer,
    fontWeight: '700',
  },
});
