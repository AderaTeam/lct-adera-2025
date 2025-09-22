import { ComponentProps, CSSProperties } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import { GridCol } from './_components/GridCol';

export interface GridProps extends Omit<ComponentProps<'div'>, 'style'> {
  gap?: number;

  rowGap?: number;

  columnGap?: number;

  grow?: boolean;

  justify?: CSSProperties['justifyContent'];

  align?: CSSProperties['alignItems'];

  columns?: number;

  overflow?: CSSProperties['overflow'];

  /**
   * TODO
   * breakpoints?: GridBreakpoints;
   */

  style?: StyleXStyles;
}

export const Grid = ({
  children,
  gap = 10,
  rowGap,
  columnGap,
  grow = false,
  justify = 'flex-start',
  align = 'center',
  columns = 12,
  overflow = 'unset',
  style,
  ...props
}: GridProps) => {
  return (
    <div
      {...props}
      {...stylex.props(
        styles.root(gap, rowGap ?? 'unset', columnGap ?? 'unset', columns, overflow, justify, align, grow ? 1 : 0),
        style
      )}>
      {children}
    </div>
  );
};

Grid.Col = GridCol;

const styles = stylex.create({
  root: (
    gap: number,
    rowGap: number | string,
    columnGap: number | string,
    columns: number,
    overflow: string,
    justifyContent: string,
    alignItems: string,
    flexGrow: number
  ) => ({
    columnGap,
    display: 'grid',
    gap,
    gridTemplateColumns: `repeat(${columns.toString()}, 1fr)`,
    rowGap,
    justifyContent,
    alignItems,
    overflow,
    flexGrow
  })
});
