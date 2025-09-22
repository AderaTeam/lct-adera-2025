import { PropsWithChildren } from 'react';
import * as stylex from '@stylexjs/stylex';
import { text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';

export interface TagProps extends PropsWithChildren {
  color?: 'orange' | 'purple' | 'blue' | 'gray' | 'yellow' | 'black';
}

const styleByColor = {
  orange: { backgroundColor: colors.orange5, color: colors.brand80 },
  purple: { backgroundColor: colors.purple20, color: colors.purple80 },
  blue: { backgroundColor: colors.blue10, color: colors.blue80 },
  gray: { backgroundColor: colors.backgroundUniversal, color: colors.black70 },
  yellow: { backgroundColor: colors.yellow20, color: colors.yellow80 },
  black: { backgroundColor: '#D7DBE6', color: colors.textPrimaryDefault }
};

export const Tag = ({ children, color = 'gray' }: TagProps) => {
  return (
    <div
      {...stylex.props(text.smallMedium, styles.root(styleByColor[color].backgroundColor, styleByColor[color].color))}>
      {children}
    </div>
  );
};

const styles = stylex.create({
  root: (backgroundColor: string, color: string) => ({
    alignItems: 'center',
    backgroundColor,
    borderRadius: 12,
    color,
    display: 'flex',
    overflow: 'hidden',
    padding: '2px 6px',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: 'fit-content'
  })
});
