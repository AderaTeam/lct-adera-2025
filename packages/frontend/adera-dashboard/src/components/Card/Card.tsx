import { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';

export const Card = ({ children }: { children?: ReactNode }) => {
  return <div {...stylex.props(styles.root)}>{children}</div>;
};

const styles = stylex.create({
  root: {
    backgroundColor: '#1D1D29',
    borderRadius: 16,
    height: '100%',
    padding: 24,
    width: '100%'
  }
});
