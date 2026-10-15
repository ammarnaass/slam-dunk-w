import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Icon } from '../Icon';
import { THEME } from '../../constants/theme';
import { episodesStyles as styles } from './episodes.styles';

interface EpisodesSearchBarProps {
  onBack?: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  isReverseOrder: boolean;
  onToggleReverse: () => void;
}

export const EpisodesSearchBar: React.FC<EpisodesSearchBarProps> = ({
  onBack,
  searchQuery,
  setSearchQuery,
  isReverseOrder,
  onToggleReverse,
}) => {
  return (
    <View style={styles.searchBarRow}>
      {onBack && (
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.8}
          accessibilityLabel="رجوع"
        >
          <Icon name="arrow_forward" size={20} color={THEME.colors.onSurface} />
        </TouchableOpacity>
      )}

      <View style={styles.searchInputContainer}>
        <Icon name="search" size={18} color={THEME.colors.onSurfaceVariant} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث برقم الحلقة أو العنوان..."
          placeholderTextColor={THEME.colors.onSurfaceVariant}
          value={searchQuery}
          onChangeText={setSearchQuery}
          textAlign="right"
        />
        {searchQuery ? (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearSearchBtn}
          >
            <Icon name="close" size={14} color={THEME.colors.onSurfaceVariant} />
          </TouchableOpacity>
        ) : null}
      </View>

      <TouchableOpacity
        style={[
          styles.sortBtn,
          isReverseOrder && styles.sortBtnActive,
        ]}
        onPress={onToggleReverse}
        activeOpacity={0.8}
        accessibilityLabel="عكس الترتيب"
      >
        <Icon
          name="swap_vert"
          size={18}
          color={
            isReverseOrder
              ? THEME.colors.primaryContainer
              : THEME.colors.onSurfaceVariant
          }
        />
      </TouchableOpacity>
    </View>
  );
};
