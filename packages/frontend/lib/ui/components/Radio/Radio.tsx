import { ComponentProps } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { AderaSize } from '../../styles/AderaSize';
import { colors } from '../../tokens.stylex';

export interface RadioProps extends Omit<ComponentProps<'button'> & RadioGroup.RadioGroupItemProps, 'style'> {
  style?: StyleXStyles;

  size?: Extract<AderaSize, 'sm' | 'md'>;
}

export function Radio({ style, size = 'md', ...props }: RadioProps) {
  const indicatorSize = size === 'md' ? 18 : 16;

  return (
    <RadioGroup.Item {...stylex.props(styles.root, styles[size], style)} {...props}>
      <RadioGroup.Indicator {...stylex.props(styles.indicator(indicatorSize))} />
    </RadioGroup.Item>
  );
}

const styles = stylex.create({
  root: {
    alignItems: 'center',
    backgroundColor: {
      default: 'white',
      ':is([aria-checked=true])': 'white'
    },
    borderColor: {
      default: colors.outlinePrimaryDefault,
      ':hover:not(:disabled):not([aria-checked=true]):not([aria-invalid=true])': colors.outlinePrimaryHover,
      ':is([aria-invalid=true]):not(:disabled):not([aria-checked=true])': colors.textPrimaryDefault,
      ':is([aria-checked=true])': colors.textPrimaryDefault
    },
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 2,
    cursor: {
      default: 'pointer',
      ':disabled': 'default'
    },
    display: 'flex',
    justifyContent: 'center',
    padding: 0
  },
  md: {
    height: 28,
    maxWidth: 28,
    minWidth: 28
  },
  sm: {
    height: 24,
    maxWidth: 24,
    minWidth: 24
  },
  indicator: (size: number) => ({
    backgroundColor: colors.textPrimaryDefault,
    borderRadius: '50%',
    height: size,
    width: size
  })
});
