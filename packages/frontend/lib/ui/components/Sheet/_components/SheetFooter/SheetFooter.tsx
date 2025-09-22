import { PropsWithChildren } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import { colors } from '@adera/ui/tokens.stylex';

export interface SheetFooterProps extends PropsWithChildren {
  style?: StyleXStyles;
}

export const SheetFooter = ({ children, style }: SheetFooterProps) => {
  return <div {...stylex.props(styles.root, style)}>{children}</div>;
};

const styles = stylex.create({
  root: {
    backgroundColor: 'white',
    borderTopColor: colors.outlinePrimaryDefault,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    padding: '12px 24px',
    position: 'sticky'
  }
});
