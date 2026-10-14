import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { Anime } from '../../types';
import { animeDetailStyles as styles } from './anime-detail.styles';

interface AnimeDetailHeroProps {
  anime: Anime;
  onBack?: () => void;
}

export const AnimeDetailHero: React.FC<AnimeDetailHeroProps> = ({ anime, onBack }) => {
  return (
    <View style={styles.heroBackdrop}>
      <Image
        source={{
          uri:
            anime.coverImage ||
            anime.bannerImage ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCqOPuKPjV7jTzRqShCn8mXLqAG0MvyZjwmXtElNs0cz9V5UfqEfnp95BX-uMb6JWf8-ptuZKz3Ef5z4OD0iz4goI2IldXNpsm0Cijg45MzSxd67nhFolMoUaOsan1uXA0HjVJ3grKbCYCef5dfbNhD9_ZsA4pKhtg7lYoObJc2V2RinHdgak6gyPk59lqqfog6XSlcoXvDgHg8Ti3awiFIjMUCYyWdrOiOAv_ClnUke0LCEDbJtwEC',
        }}
        style={styles.heroBackdropImage}
        resizeMode="cover"
      />

      {/* Layered Ambient Scrims */}
      <View style={styles.heroGradientBottom} />
      <View style={styles.heroGradientSoft} />

      {/* Back Button if present */}
      {onBack && (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.8}
          accessibilityLabel="رجوع"
        >
          <Icon name="arrow_forward" size={24} color={THEME.colors.onSurface} />
        </TouchableOpacity>
      )}

      {/* Hero Floating Badges & Title Block */}
      <View style={styles.heroContent}>
        {/* Badges Row */}
        <View style={styles.badgesRow}>
          <View style={styles.scoreBadge}>
            <Icon name="star" size={14} color={THEME.colors.onSecondaryContainer} filled />
            <Text style={styles.scoreBadgeText}>
              {anime.rating
                ? `${
                    typeof anime.rating === 'number'
                      ? anime.rating.toFixed(1)
                      : parseFloat(anime.rating) > 0
                      ? parseFloat(anime.rating).toFixed(1)
                      : String(anime.rating)
                  }/10`
                : '9.4/10'}
            </Text>
          </View>

          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>{anime.releaseYear || '1993'}</Text>
          </View>

          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>
              مكتمل ({anime.totalEpisodes || 101} حلقة)
            </Text>
          </View>

          <View style={styles.tagIconic}>
            <Text style={styles.tagIconicText}>أيقونة رياضية</Text>
          </View>
        </View>

        {/* Title & Subtitle */}
        <View style={styles.titleSection}>
          <Text style={styles.displayTitle}>{anime.title}</Text>
          <Text style={styles.displaySubtitle}>
            Slam Dunk • スラムダンク
          </Text>
        </View>

        {/* Genre Chips */}
        <View style={styles.genreChipsRow}>
          {(anime.genres && anime.genres.length > 0
            ? anime.genres
            : ['رياضي', 'كوميديا', 'إثارة وتحدي', 'شبابي كلاسيكي']
          ).map((genre, idx) => (
            <View key={idx} style={styles.genreChip}>
              <Text style={styles.genreChipText}>{genre}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
