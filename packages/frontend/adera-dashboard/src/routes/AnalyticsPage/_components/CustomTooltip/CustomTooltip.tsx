import { text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import * as stylex from '@stylexjs/stylex';
import { ReactNode } from 'react';

export const CustomTooltip = ({ children }: { children: ReactNode }) => {
  return <div {...stylex.props(styles.root, text.defaultMedium)}>{children}</div>;
};

const styles = stylex.create({
  root: {
    paddingBlock: 8,
    paddingInline: 12,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: colors.textBlueDefault,
    color: colors.textSecondaryDefault,
    borderRadius: 12,
    backdropFilter: 'blur(4px)'
  }
});
