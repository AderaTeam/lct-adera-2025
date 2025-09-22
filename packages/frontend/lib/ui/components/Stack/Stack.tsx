import { ComponentProps, CSSProperties } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';

export interface StackProps extends Omit<ComponentProps<'div'>, 'style'> {
  gap?: number;

  align?: CSSProperties['alignItems'];

  justify?: CSSProperties['justifyContent'];

  style?: StyleXStyles;
}

export const Stack = ({
  children,
  gap = 8,
  align = 'stretch',
  justify = 'flex-start',
  style,
  ...props
}: StackProps) => {
  return (
    <div {...stylex.props(styles.root(align, gap, justify), style)} {...props}>
      {children}
    </div>
  );
};

const styles = stylex.create({
  root: (alignItems: string, gap: number, justifyContent: string) => ({
    alignItems,
    display: 'flex',
    flexDirection: 'column',
    gap,
    justifyContent
  })
});
