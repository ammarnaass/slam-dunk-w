import { StyleSheet } from 'react-native';
import { heroStyles } from './hero.styles';
import { vipStyles } from './vip.styles';
import { tabsStyles } from './tabs.styles';
import { formsStyles } from './forms.styles';
import { modalsStyles } from './modals.styles';

export * from './hero.styles';
export * from './vip.styles';
export * from './tabs.styles';
export * from './forms.styles';
export * from './modals.styles';

export const styles = StyleSheet.create({
  ...heroStyles,
  ...vipStyles,
  ...tabsStyles,
  ...formsStyles,
  ...modalsStyles,
});
