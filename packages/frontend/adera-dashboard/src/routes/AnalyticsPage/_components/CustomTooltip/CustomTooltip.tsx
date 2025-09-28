import { ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';

export const CustomTooltip = ({ children }: { children: ReactNode }) => {
  return <div {...stylex.props(styles.root, text.defaultMedium)}>{children}</div>;
};

const styles = stylex.create({
  root: {
    backdropFilter: 'blur(4px)',
    borderColor: colors.textBlueDefault,
    borderRadius: 12,
    borderStyle: 'solid',
    borderWidth: 2,
    color: colors.textSecondaryDefault,
    paddingBlock: 8,
    paddingInline: 12
  }
});
