import { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';

export interface GridColProps extends Omit<ComponentProps<'div'>, 'style'> {
  span?: number;

  style?: StyleXStyles;

  asChild?: boolean;
}

export const GridCol = ({ children, span = 1, style, asChild, ...props }: GridColProps) => {
  const Component = asChild ? Slot : 'div';

  return (
    <Component {...props} {...stylex.props(styles.root(span), style)}>
      {children}
    </Component>
  );
};

const styles = stylex.create({
  root: (span: number) => ({
    gridColumn: `span ${span.toString()}`
  })
});
