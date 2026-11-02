import { StyleSheet } from 'react-native';
import { heroStyles } from './hero.styles';
import { sectionStyles } from './section.styles';
import { continueStyles } from './continue.styles';
import { spotlightStyles } from './spotlight.styles';
import { cardsStyles } from './cards.styles';

export * from './hero.styles';
export * from './section.styles';
export * from './continue.styles';
export * from './spotlight.styles';
export * from './cards.styles';

export const styles = StyleSheet.create({
  ...heroStyles,
  ...sectionStyles,
  ...continueStyles,
  ...spotlightStyles,
  ...cardsStyles,
});
