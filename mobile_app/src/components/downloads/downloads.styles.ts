import { screenStyles } from './styles/screen.styles';
import { storageCardStyles } from './styles/storageCard.styles';
import { episodeCardStyles } from './styles/episodeCard.styles';
import { settingsCardStyles } from './styles/settingsCard.styles';
import { floatingBarStyles } from './styles/floatingBar.styles';

export { screenStyles } from './styles/screen.styles';
export { storageCardStyles } from './styles/storageCard.styles';
export { episodeCardStyles } from './styles/episodeCard.styles';
export { settingsCardStyles } from './styles/settingsCard.styles';
export { floatingBarStyles } from './styles/floatingBar.styles';

export const styles = {
  ...screenStyles,
  ...storageCardStyles,
  ...episodeCardStyles,
  ...settingsCardStyles,
  ...floatingBarStyles,
};
