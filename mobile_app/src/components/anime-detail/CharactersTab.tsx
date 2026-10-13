import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { THEME } from '../../constants/theme';
import { Character } from '../../types';
import { CharacterCard } from '../CharacterCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const DEFAULT_CHARACTERS: Character[] = [
  {
    id: 'sakuragi',
    name: 'حسان',
    name_ar: 'حسان',
    number: '10',
    position: 'لاعب ارتكاز (PF)',
    role: 'الملتقط البارع',
    description: 'الملتقط البارع',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBay2pNFvEP6okJNNuEvpHzuEVvNakcGDCWWDAmOvdJZeul6pC3BodMEu14ne2FnDGa8wvKjVIwn8a-xBviRbDCTDIikOPsiNQV3xMoHPvi3khhH8tUs7L1kXpXfsHEKhyqOA-EpQhzNTHooB7zCwa5AXMZoasYDuaB62BZUUPyQjlHygseJsWCuqGNxj5DAmcU5117TQEAXXx19g3yLq-mdUUmDuCAKFi3AJcRogWhiW5RTRWuuvee',
  },
  {
    id: 'rukawa',
    name: 'فادي',
    name_ar: 'فادي',
    number: '11',
    position: 'جناح (SF)',
    role: 'الهداف الأول',
    description: 'الهداف الأول',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBY9Oe4UW-RkjU3Aa1WpIqZ2KHzFPVTRjOM8l0Jw1ZpBbKo-ey_0UNBpITLi2BwPSA511RuCabriVm7fSM_UTJaEPBflekSUUnzliYAQbyWo_qF3qArq3g9KjIPQhS0HKZ0SShpFG7IsfI5SOD5S5xtO8Z38WWSmy4vUba3kal-SCkbh409d_Rz8BegmAQLI5J65IwzSbEevZowgHA3LFcbMBOicIHverACdS2EwKF-8grIdBmgr-qP',
  },
  {
    id: 'akagi',
    name: 'سعد',
    name_ar: 'سعد',
    number: '4',
    position: 'وسط (C)',
    role: 'قائد الفريق',
    description: 'قائد الفريق',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA7sHPlqoJzhro2mLsetVPnN2mlUNGPJHYBrGFuAGKxX7xEJzSF4gntCZ2TWcZ6l9RGFFMhgkKU50sS6uuX2GbRiJ80a8bJE6FLV5oD7d5o9kBJvzJ8DZZYvnRHiZrJta7Xz1hIrywUeAAoDwMfMcc3mxl0FVCFoNbCtrL8xugj9ORnQDa-9Mjav9FLzSrPMv1RfDlVh3HV4joBq8AMebBAHcr7CRf7-R4CUXvLDtgb9NQs3G_XlQxV',
  },
  {
    id: 'miyagi',
    name: 'بدر',
    name_ar: 'بدر',
    number: '7',
    position: 'صانع ألعاب (PG)',
    role: 'البرق السريع',
    description: 'البرق السريع',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqSFt_4ghEuGAvubvgi9yK1jxXuChE7KsKGa_m4tayq-sZkRwoOOYoffdrVnHubf8LNhZ1rYAUBuothXqqSo6sTwSFy5yo5xWrhBea6g7bBQqjPTHQKfGDKfPtuPrbtxxiCosSPq3PSerB4Rqkwb9GZDl3m5SR4RUnQ6700uvh2QUWhYSlFFUxQvKPn34qZis4qlRFWhC65YMLSBWox_CG3ILF02Y9jt21eMDlrJ7yB99WtG5WturR',
  },
  {
    id: 'mitsui',
    name: 'جواد',
    name_ar: 'جواد',
    number: '14',
    position: 'مدافع مسدد (SG)',
    role: 'قناص الثلاثيات',
    description: 'قناص الثلاثيات',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB2L0QzTucO0k5-IEPwNIsk-xSXUXEL1fOvHfj_CPhdJqUUNj-ZifftMoTuKmm4yLCl3llzgmmem6ya3MJRr9Rva6jpIQoPhwvOjMVJhOa0obXUMer8SarhS09lTUpTrNblMCyj2GZ3Ig43HDZK0XH6ieonmSIA0PwqpJ_qba4kjravri9Z8CEHO63JeQhYgnkyAcpqJQ9O3X4P-D4-PH_pf7f3XqifVRjDmShObANWs1amR-pzMSr',
  },
];

interface CharactersTabProps {
  characters?: Character[];
  onCharacterPress?: (char: Character) => void;
}

export const CharactersTab: React.FC<CharactersTabProps> = ({
  characters,
  onCharacterPress,
}) => {
  const charList = characters && characters.length > 0 ? characters : DEFAULT_CHARACTERS;
  const cardWidth = (SCREEN_WIDTH - THEME.spacing.margin * 2 - 16) / 2;

  return (
    <View style={styles.charactersTabContent}>
      <View style={styles.charactersGrid}>
        {charList.map((char) => (
          <CharacterCard
            key={char.id}
            character={char}
            onPress={() => onCharacterPress?.(char)}
            width={cardWidth}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  charactersTabContent: {
    paddingHorizontal: THEME.spacing.margin,
    marginTop: 14,
  },
  charactersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
