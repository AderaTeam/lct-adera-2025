import { ComponentProps } from 'react';
import * as RadioGroupRadix from '@radix-ui/react-radio-group';
import { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';

export interface RadioGroupProps extends Omit<ComponentProps<'div'> & RadioGroupRadix.RadioGroupProps, 'style'> {
  style?: StyleXStyles;
}

export function RadioGroup({ style, ...props }: RadioGroupProps) {
  return (
    <RadioGroupRadix.Root {...stylex.props(styles.root, style)} {...props}>
      {props.children}
    </RadioGroupRadix.Root>
  );
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  }
});
