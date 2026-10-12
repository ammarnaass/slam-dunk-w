import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '../../constants/theme';
import { Icon } from '../Icon';
import { styles } from './home.styles';

interface HomeFanQuoteProps {
  quote: {
    quote: string;
    author: string;
  };
  onRefreshQuote: () => void;
}

export const HomeFanQuote: React.FC<HomeFanQuoteProps> = ({
  quote,
  onRefreshQuote,
}) => {
  return (
    <View style={styles.quoteCard}>
      <View style={styles.quoteContent}>
        <View style={styles.quoteIconCircle}>
          <Icon name="format_quote" size={22} color={THEME.colors.primaryContainer} />
        </View>
        <View style={styles.quoteTextContainer}>
          <Text style={styles.quoteBody}>"{quote.quote}"</Text>
          <Text style={styles.quoteAuthor}>{quote.author}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.quoteRefreshBtn}
        onPress={onRefreshQuote}
        activeOpacity={0.7}
        accessibilityLabel="مقولة أخرى"
      >
        <Icon name="cached" size={18} color={THEME.colors.onSurfaceVariant} />
      </TouchableOpacity>
    </View>
  );
};
