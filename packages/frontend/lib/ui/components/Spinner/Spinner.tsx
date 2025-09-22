import { ComponentProps } from 'react';
import { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { AderaSize } from '../../styles/AderaSize';
import { colors } from '../../tokens.stylex';
import SpinnerIcon from './spinner.svg?react';

export interface SpinnerProps extends Omit<ComponentProps<'svg'>, 'style'> {
  style?: StyleXStyles;

  size?: Extract<AderaSize, 'sm' | 'md' | 'lg'>;
}

export function Spinner({ style, size = 'sm', ...props }: SpinnerProps) {
  return <SpinnerIcon {...stylex.props(styles.base, styles[size], style)} {...props} />;
}

const rotate = stylex.keyframes({
  from: {
    transform: 'rotate(0deg)'
  },
  to: {
    transform: 'rotate(360deg)'
  }
});

const styles = stylex.create({
  base: {
    animationDuration: '0.7s',
    animationIterationCount: 'infinite',
    animationName: rotate,
    animationTimingFunction: 'linear',
    color: colors.brand80
  },
  sm: {},
  md: {},
  lg: { height: 50, width: 50 }
});
