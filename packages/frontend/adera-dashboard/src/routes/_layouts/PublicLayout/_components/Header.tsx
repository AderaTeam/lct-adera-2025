import { useEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { headers, Logo } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { Tab } from './Tab';

export const Header = () => {
  const [, setScrolled] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (filtersRef.current) {
        const offset = filtersRef.current.getBoundingClientRect().top;
        setScrolled(offset <= 84); // 84px = высота header
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header {...stylex.props(styles.root)}>
      <div>
        <nav {...stylex.props(styles.nav)}>
          <Logo />
          <Tab to="/">Общая аналитика</Tab>
          <Tab>Загруженные данные</Tab>
        </nav>
      </div>
      <div>
        <h1 {...stylex.props(headers.h1Semibold)}>Общая аналитика</h1>
      </div>
    </header>
  );
};

const styles = stylex.create({
  root: {
    backgroundColor: colors.backgroundPrimary,
    color: colors.textPrimaryWhite,
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    left: 0,
    paddingBlock: '20px 0',
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
