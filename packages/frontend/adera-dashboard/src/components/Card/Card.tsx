import { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import { colors } from '@adera/ui/tokens.stylex';

export const Card = ({ children, style }: { children?: ReactNode; style?: StyleXStyles }) => {
  return <div {...stylex.props(styles.root, style)}>{children}</div>;
};

const styles = stylex.create({
  root: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    height: '100%',
    padding: 24,
    width: '100%'
  }
});
