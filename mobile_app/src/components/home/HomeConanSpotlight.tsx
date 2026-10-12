import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Anime } from '../../types';
import { Icon } from '../Icon';
import { styles } from './home.styles';

interface HomeConanSpotlightProps {
  onAnimePress: (anime: Anime) => void;
  onViewAllAnimes?: () => void;
}

export const HomeConanSpotlight: React.FC<HomeConanSpotlightProps> = ({
  onAnimePress,
  onViewAllAnimes,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.titleBarRed} />
          <View>
            <Text style={styles.sectionTitle}>عالم المحقق كونان</Text>
            <Text style={styles.sectionSubtitle}>
              أحدث القضايا والأفلام الحصرية المدبلجة
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.sectionLink}
          onPress={onViewAllAnimes}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionLinkText}>عرض الكل</Text>
          <Icon name="chevronLeft" size={16} color={THEME.colors.primaryContainer} />
        </TouchableOpacity>
      </View>

      <View style={styles.grid2Col}>
        {/* Conan Card 1: Movie */}
        <TouchableOpacity
          style={styles.conanCard}
          onPress={() =>
            onAnimePress({
              id: 'conan-movie-27',
              title: 'المحقق كونان: نجم المليون دولار',
              description: 'كونان وكيد في مواجهة هوكايدو',
              coverImage:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDLG82TQKB8CcEJ-ax9yoNpH1vrdpUoKVmrf7pM6HyoO0AmqYvr8aKEtLLohQv6E9rLqcsmFjx6I3UMZ6PcLNKa5ozr9NXrNLTy8MdqafUjFgVR2Yf5KiR9MsL-wCD3cEg-6c9EH0n1Qc0ryyRTCjKk7rQt-_XTFXWrCxyFvKV1w3dwFVFjUEagLcZcpWkewGP_bCTcz5qD4lOr-8L_fz1OoHuo-egnf4I75lMgiEKCOdFnvPjGJiB1',
              rating: 9.1,
            })
          }
          activeOpacity={0.88}
        >
          <View style={styles.conanImageFrame}>
            <Image
              source={{
                uri:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuDLG82TQKB8CcEJ-ax9yoNpH1vrdpUoKVmrf7pM6HyoO0AmqYvr8aKEtLLohQv6E9rLqcsmFjx6I3UMZ6PcLNKa5ozr9NXrNLTy8MdqafUjFgVR2Yf5KiR9MsL-wCD3cEg-6c9EH0n1Qc0ryyRTCjKk7rQt-_XTFXWrCxyFvKV1w3dwFVFjUEagLcZcpWkewGP_bCTcz5qD4lOr-8L_fz1OoHuo-egnf4I75lMgiEKCOdFnvPjGJiB1',
              }}
              style={styles.conanImage}
              resizeMode="cover"
            />
            <View style={styles.conanPillRed}>
              <Text style={styles.conanPillRedText}>فيلم حصري 27</Text>
            </View>
            <View style={styles.conanRating}>
              <Icon name="star" size={12} color={THEME.colors.secondary} filled />
              <Text style={styles.conanRatingText}>9.1</Text>
            </View>
          </View>

          <View style={styles.conanDetails}>
            <Text style={styles.conanTitle} numberOfLines={1}>
              نجم المليون دولار
            </Text>
            <Text style={styles.conanDesc} numberOfLines={1}>
              كونان وكيد في مواجهة هوكايدو
            </Text>
            <View style={styles.conanMetaRow}>
              <Text style={styles.conanMetaRed}>مدبلج + مترجم</Text>
              <Text style={styles.conanMetaMuted}>110 دقيقة</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Conan Card 2: Episode Arc */}
        <TouchableOpacity
          style={styles.conanCard}
          onPress={() =>
            onAnimePress({
              id: 'conan-arc',
              title: 'المحقق كونان: المنظمة السوداء',
              description: 'سلسلة كشف الحقيقة الكبرى',
              coverImage:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuC15B-CNbesnx2byAr1Vy_CLVp0X3jJjReKbQbMmgFv2NdhTYfAolD0i9MiBqwFKgK-7ewa-ZGxI7yYFuwZKsCFl27QJ8DCDNMy9rupG3UrERt8yIhSr5EHxMrMGogXwUPWdK6LPjQFFaXXnyD-P-5owY5zSeAu9yaqWYehLApoEinUeLWp9BwPgVsEE2dPTTHWoMn7bS_a1TwmMNqKGZ6ZE3f1UjwFY-lkO52IA8AVuwvUGSNefkVf',
              rating: 8.9,
            })
          }
          activeOpacity={0.88}
        >
          <View style={styles.conanImageFrame}>
            <Image
              source={{
                uri:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuC15B-CNbesnx2byAr1Vy_CLVp0X3jJjReKbQbMmgFv2NdhTYfAolD0i9MiBqwFKgK-7ewa-ZGxI7yYFuwZKsCFl27QJ8DCDNMy9rupG3UrERt8yIhSr5EHxMrMGogXwUPWdK6LPjQFFaXXnyD-P-5owY5zSeAu9yaqWYehLApoEinUeLWp9BwPgVsEE2dPTTHWoMn7bS_a1TwmMNqKGZ6ZE3f1UjwFY-lkO52IA8AVuwvUGSNefkVf',
              }}
              style={styles.conanImage}
              resizeMode="cover"
            />
            <View style={styles.conanPillDark}>
              <Text style={styles.conanPillDarkText}>حلقة جديدة</Text>
            </View>
            <View style={styles.conanRating}>
              <Icon name="star" size={12} color={THEME.colors.secondary} filled />
              <Text style={styles.conanRatingText}>8.9</Text>
            </View>
          </View>

          <View style={styles.conanDetails}>
            <Text style={styles.conanTitle} numberOfLines={1}>
              أسرار المنظمة السوداء
            </Text>
            <Text style={styles.conanDesc} numberOfLines={1}>
              سلسلة كشف الحقيقة الكبرى
            </Text>
            <View style={styles.conanMetaRow}>
              <Text style={styles.conanMetaRed}>الحلقة 1120</Text>
              <Text style={styles.conanMetaMuted}>FHD</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
