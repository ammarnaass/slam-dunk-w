import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Character } from '../types';
import { THEME } from '../constants/theme';
import { Icon } from '../components/Icon';
import { CharacterCard } from '../components/CharacterCard';
import { fetchCharacters } from '../services/api';
import { DEFAULT_CHARACTERS } from '../constants/characters-data';
import { styles } from '../components/characters/characters.styles';
import { CharacterDetailModal } from '../components/characters/CharacterDetailModal';

interface CharactersScreenProps {
  onBack?: () => void;
}

export const CharactersScreen: React.FC<CharactersScreenProps> = ({ onBack }) => {
  const [characters, setCharacters] = useState<Character[]>(DEFAULT_CHARACTERS);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [activeModalChar, setActiveModalChar] = useState<Character | null>(null);

  useEffect(() => {
    fetchCharacters().then((data) => {
      if (data && data.length > 0) {
        setCharacters(data);
      }
    });
  }, []);

  const filterTabs = [
    { key: 'all', label: 'كل الشخصيات' },
    { key: 'conan', label: 'المحقق كونان' },
    { key: 'slam-dunk', label: 'سلام دانك' },
    { key: 'heroes', label: 'الأبطال الرئيسيون' },
  ];

  const filteredCharacters = useMemo(() => {
    if (selectedTab === 'all') return characters;
    return characters.filter((c) => {
      if (selectedTab === 'conan') {
        return (
          c.animeId === 'conan' ||
          (c.name_ar || '').includes('كونان') ||
          (c.name_ar || '').includes('سينشي') ||
          (c.name_ar || '').includes('ران') ||
          (c.name_ar || '').includes('موري')
        );
      }
      if (selectedTab === 'slam-dunk') {
        return (
          c.animeId === 'slam-dunk' ||
          (c.team || '').includes('شوهوكو') ||
          (c.team || '').includes('الصقور') ||
          (c.name_ar || '').includes('ساكوراجي') ||
          (c.name_ar || '').includes('روكاوا') ||
          (c.name_ar || '').includes('أكاجي')
        );
      }
      if (selectedTab === 'heroes') {
        const r = (c.role || '').toLowerCase();
        return r.includes('بطل') || r.includes('رئيسي');
      }
      return true;
    });
  }, [characters, selectedTab]);

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
            <Text style={styles.headerTitle}>أبطال وشخصيات ANIME DAZE</Text>
            <Text style={styles.headerSub}>موسوعة الأنمي ومؤدي الأصوات</Text>
          </View>
        </View>

        {/* Hero Showcase Card */}
        <View style={styles.heroBanner}>
          <View style={styles.badgeRow}>
            <Icon name="sparkles" size={14} color={THEME.colors.primaryContainer} />
            <Text style={styles.badgeText}>موسوعة الأنمي الكونية</Text>
          </View>
          <Text style={styles.heroMainTitle}>أساطير وأبطال الأنمي</Text>
          <Text style={styles.heroDesc}>
            تعرف على أبطال الأنمي المفضلين، انتماءاتهم، مؤدي أصواتهم بالدبلجة والأداء الياباني، وأسرار قوتهم.
          </Text>
        </View>

        {/* Team / Anime Filter Tabs */}
        <View style={styles.filterPillsRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterPillsList}
          >
            {filterTabs.map((t) => {
              const isSelected = selectedTab === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  style={[styles.teamPill, isSelected && styles.teamPillActive]}
                  onPress={() => setSelectedTab(t.key)}
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
          <Text style={styles.detailedSectionTitle}>بطاقات الشخصيات الكاملة</Text>

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
                          'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
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
                      <Text style={styles.roleTagText}>{char.role || char.position || 'شخصية رئيسية'}</Text>
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
                    <Text style={styles.teamBadgeText}>
                      {char.team || (char.animeId === 'conan' ? 'المحقق كونان' : 'سلام دانك')}
                    </Text>
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

      {/* Reusable Character Detail Modal */}
      <CharacterDetailModal
        character={activeModalChar}
        onClose={() => setActiveModalChar(null)}
      />
    </View>
  );
};
