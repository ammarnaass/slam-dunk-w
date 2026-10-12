import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Anime } from '../../types';
import { Icon } from '../Icon';
import { styles } from './home.styles';

interface HomeGoldenNostalgiaProps {
  onAnimePress: (anime: Anime) => void;
  onViewAllAnimes?: () => void;
}

export const HomeGoldenNostalgia: React.FC<HomeGoldenNostalgiaProps> = ({
  onAnimePress,
  onViewAllAnimes,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.titleBarGold} />
          <View>
            <Text style={styles.sectionTitle}>كلاسيكيات الزمن الجميل</Text>
            <Text style={styles.sectionSubtitle}>
              نوستالجيا الدبلجة العربية وشوجو وجامبو
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.sectionLink}
          onPress={onViewAllAnimes}
          activeOpacity={0.7}
        >
          <Text style={styles.sectionLinkText}>استكشاف</Text>
          <Icon name="chevronLeft" size={16} color={THEME.colors.primaryContainer} />
        </TouchableOpacity>
      </View>

      <View style={styles.grid3Col}>
        {/* Classic 1: Captain Tsubasa */}
        <TouchableOpacity
          style={styles.classicCard}
          onPress={() =>
            onAnimePress({
              id: 'captain-majed',
              title: 'الكابتن ماجد',
              description: 'الجزء الثاني كاملاً - ذكريات الطفولة',
              coverImage:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuB4T-9NG-yontq-_VgAf5yK8OQDJbVL7UWemnuz0UwTHpkK1eP41SpaooqRctEH4FM8mHVmLmhfoFrcTQqEH2OIOr14_puL271SReQfYAYXybEj3D7jSL8R5YyJ2_oHBpENqRcQK9uo00MbRZZ-Oe45iiuxCh2MjbemCKJHTvB_vKZkudajItvh3knEl014r54VAVy5rxk2ieSQuinvMj6x4AKC73MpxroLA6yxfKU0JEd5vsFhdJ1s',
              totalEpisodes: 128,
            })
          }
          activeOpacity={0.85}
        >
          <View style={styles.classicImageFrame}>
            <Image
              source={{
                uri:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuB4T-9NG-yontq-_VgAf5yK8OQDJbVL7UWemnuz0UwTHpkK1eP41SpaooqRctEH4FM8mHVmLmhfoFrcTQqEH2OIOr14_puL271SReQfYAYXybEj3D7jSL8R5YyJ2_oHBpENqRcQK9uo00MbRZZ-Oe45iiuxCh2MjbemCKJHTvB_vKZkudajItvh3knEl014r54VAVy5rxk2ieSQuinvMj6x4AKC73MpxroLA6yxfKU0JEd5vsFhdJ1s',
              }}
              style={styles.classicImage}
              resizeMode="cover"
            />
            <View style={styles.classicEpTag}>
              <Text style={styles.classicEpText}>128 حلقة</Text>
            </View>
          </View>
          <View style={styles.classicDetails}>
            <Text style={styles.classicTitle} numberOfLines={1}>
              الكابتن ماجد
            </Text>
            <Text style={styles.classicSubtitle} numberOfLines={1}>
              الجزء الثاني كاملاً
            </Text>
          </View>
        </TouchableOpacity>

        {/* Classic 2: Adnan & Lina */}
        <TouchableOpacity
          style={styles.classicCard}
          onPress={() =>
            onAnimePress({
              id: 'adnan-lina',
              title: 'عدنان ولينا',
              description: 'نسخة مُرممة 4K',
              coverImage:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuC3x1PhWJSc2Ga3PyVDud7Jw8d9qa_2bVJS2MBlje2Y776rmI958znPzzVCMWY6S10GjmC5LWRPLaJA1e9RHhTQan1tReyxU2moqPsChrCWQcc_V6rlfG2IR9ErH3vLr_P_r3hESHVmtLMMhWpsEgJjgOEG4y6TShK9JJr3hX-6Ou3ejBbnMfKEKJeOUwvq5IiNejlyADEv0R0ycDsa3yE_BJ47kY6j1_NR2RcO8wrjg1tERtZNlZQn',
              totalEpisodes: 26,
            })
          }
          activeOpacity={0.85}
        >
          <View style={styles.classicImageFrame}>
            <Image
              source={{
                uri:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuC3x1PhWJSc2Ga3PyVDud7Jw8d9qa_2bVJS2MBlje2Y776rmI958znPzzVCMWY6S10GjmC5LWRPLaJA1e9RHhTQan1tReyxU2moqPsChrCWQcc_V6rlfG2IR9ErH3vLr_P_r3hESHVmtLMMhWpsEgJjgOEG4y6TShK9JJr3hX-6Ou3ejBbnMfKEKJeOUwvq5IiNejlyADEv0R0ycDsa3yE_BJ47kY6j1_NR2RcO8wrjg1tERtZNlZQn',
              }}
              style={styles.classicImage}
              resizeMode="cover"
            />
            <View style={styles.classicEpTag}>
              <Text style={styles.classicEpText}>26 حلقة</Text>
            </View>
          </View>
          <View style={styles.classicDetails}>
            <Text style={styles.classicTitle} numberOfLines={1}>
              عدنان ولينا
            </Text>
            <Text style={styles.classicSubtitle} numberOfLines={1}>
              نسخة مُرممة 4K
            </Text>
          </View>
        </TouchableOpacity>

        {/* Classic 3: Hunter x Hunter 1999 */}
        <TouchableOpacity
          style={styles.classicCard}
          onPress={() =>
            onAnimePress({
              id: 'hunter-1999',
              title: 'القناص 1999',
              description: 'الدبلجة الأصلية سبيستون',
              coverImage:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBThQeOlyY4c2TpQ04X5xjIVNt0Uo0Gz75f7mOOWvfIFNgiwbwBGmZ9vNjhxRvv5mm_QkbUmnsue9zux3hFGTQQDzMVcWho6GwnDU5RAgORuGF0QbPQH7OXL534zNFpZdV6LtyOavUpSUQmg-U7i5FMihk_vLXw4fiI3ppw_8ljUBz8abKJxwPQv4b9f3JCe3PGKCmQHUfWhz_x3n2M5V-ktHUFTMbXEzu5C0aS3U0UnN_HTGenUCSF',
              totalEpisodes: 62,
            })
          }
          activeOpacity={0.85}
        >
          <View style={styles.classicImageFrame}>
            <Image
              source={{
                uri:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBThQeOlyY4c2TpQ04X5xjIVNt0Uo0Gz75f7mOOWvfIFNgiwbwBGmZ9vNjhxRvv5mm_QkbUmnsue9zux3hFGTQQDzMVcWho6GwnDU5RAgORuGF0QbPQH7OXL534zNFpZdV6LtyOavUpSUQmg-U7i5FMihk_vLXw4fiI3ppw_8ljUBz8abKJxwPQv4b9f3JCe3PGKCmQHUfWhz_x3n2M5V-ktHUFTMbXEzu5C0aS3U0UnN_HTGenUCSF',
              }}
              style={styles.classicImage}
              resizeMode="cover"
            />
            <View style={styles.classicEpTag}>
              <Text style={styles.classicEpText}>62 حلقة</Text>
            </View>
          </View>
          <View style={styles.classicDetails}>
            <Text style={styles.classicTitle} numberOfLines={1}>
              القناص 1999
            </Text>
            <Text style={styles.classicSubtitle} numberOfLines={1}>
              الدبلجة الأصلية
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
