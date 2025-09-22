import { PropsWithChildren } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';

export interface SheetHeaderProps extends PropsWithChildren {
  style?: StyleXStyles;
}

export function SheetHeader({ children, style }: SheetHeaderProps) {
  return <div {...stylex.props(styles.base, style)}>{children}</div>;
}

const styles = stylex.create({
  base: {
    alignItems: 'center',
    backgroundColor: 'white',
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    left: 0,
    padding: '18px 24px',
    position: 'sticky',
    top: 0,
    width: '100%',
    zIndex: 10
  }
});
