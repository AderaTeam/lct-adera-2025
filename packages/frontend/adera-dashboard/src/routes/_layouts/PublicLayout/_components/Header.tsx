import * as stylex from '@stylexjs/stylex';
import { Logo } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Tab } from './Tab';

export const Header = () => {
  return (
    <header {...stylex.props(styles.root)}>
      <nav {...stylex.props(styles.nav)}>
        <Logo />
        <Tab to="/">Общая аналитика</Tab>
        <Tab to="/upload">Загруженные данные</Tab>
      </nav>
    </header>
  );
};

const styles = stylex.create({
  root: {
    backgroundColor: colors.backgroundPrimary,
    color: colors.textPrimaryWhite,
    display: 'flex',
    flexDirection: 'column',
    left: 0,
    paddingBlock: 20,
    paddingInline: { default: 40, '@media (min-width: 1580px)': 80 },
    position: 'sticky',
    top: 0,
    width: '100%',
    zIndex: 10
  },
  nav: {
    alignItems: 'center',
    display: 'flex',
    gap: 16
  }
});
