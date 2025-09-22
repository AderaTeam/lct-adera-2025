import { ComponentProps, CSSProperties } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';

export interface FlexProps extends Omit<ComponentProps<'div'>, 'style'> {
  gap?: number;

  rowGap?: number;

  columnGap?: number;

  align?: CSSProperties['alignItems'];

  justify?: CSSProperties['justifyContent'];

  wrap?: CSSProperties['flexWrap'];

  direction?: CSSProperties['flexDirection'];

  style?: StyleXStyles;
}

export const Flex = ({
  children,
  gap = 10,
  rowGap,
  columnGap,
  align = 'center',
  justify = 'flex-start',
  wrap = 'wrap',
  direction = 'row',
  style,
  ...props
}: FlexProps) => {
  return (
    <div
      {...stylex.props(
        styles.root(gap, rowGap ?? 'unset', columnGap ?? 'unset', align, justify, wrap, direction),
        style
      )}
      {...props}>
      {children}
    </div>
  );
};

const styles = stylex.create({
  root: (
    gap: number,
    rowGap: number | string,
    columnGap: number | string,
    alignItems: string,
    justifyContent: string,
    flexWrap: string,
    flexDirection: string
  ) => ({
    alignItems,
    columnGap,
    display: 'flex',
    flexDirection,
    flexWrap,
    gap,
    justifyContent,
    rowGap
  })
});
