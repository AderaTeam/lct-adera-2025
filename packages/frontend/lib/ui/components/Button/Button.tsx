import { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';
import { AderaSize } from '../../styles/AderaSize';
import { Spinner } from '../Spinner';
import { ButtonVariant, ButtonWidth } from './Button.types';

export interface ButtonProps extends Omit<ComponentProps<'button'>, 'style'> {
  style?: StyleXStyles;

  asChild?: boolean;

  width?: ButtonWidth;

  variant?: ButtonVariant;

  size?: Extract<AderaSize, 'sm' | 'md' | 'lg'>;

  loading?: boolean;
}

export function Button({
  children,
  style,
  asChild,
  width = ButtonWidth.fit,
  variant = ButtonVariant.primary,
  size = 'md',
  loading,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      {...stylex.props(styles.base, text.defaultMedium, styles[variant], styles[size], styles[width], style)}
      {...props}>
      {loading ? <Spinner /> : children}
    </Component>
  );
}

const styles = stylex.create({
  base: {
    alignItems: 'center',
    appearance: 'none',
    borderStyle: 'none',
    borderWidth: 2,
    boxSizing: 'border-box',
    cursor: {
      default: 'pointer',
      ':disabled': 'default'
    },
    display: 'inline-flex',
    gap: 8,
    justifyContent: 'center',
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'all 0.2s',
    userSelect: 'none',
    verticalAlign: 'top',
    whiteSpace: 'nowrap'
  },
  // variants
  primary: {
    backgroundColor: {
      default: colors.buttonPrimaryDefault,
      ':not(:disabled):hover': colors.buttonPrimaryHover,
      ':not(:disabled):active': colors.buttonPrimaryActive,
      ':disabled': colors.backgroundSecondary
    },
    color: {
      default: 'white',
      ':disabled': colors.black70
    }
  },
  ghost: {
    backgroundColor: {
      default: 'transparent',
      ':not(:disabled):hover': colors.buttonSecondaryHover,
      ':not(:disabled):active': colors.buttonSecondaryActive,
      ':is([aria-selected=true])': colors.buttonSecondaryActive,
      ':disabled': colors.backgroundSecondary
    },
    color: {
      default: colors.textPrimaryDefault,
      ':not(:disabled):hover': colors.textPrimaryHover,
      ':not(:disabled):active': colors.textPrimaryActive,
      ':is([aria-selected=true])': colors.textPrimaryActive,
      ':disabled': colors.black70
    }
  },
  tertiaryAccent: {
    backgroundColor: {
      default: 'rgba(90, 128, 255, 0.2)',
      ':not(:disabled):hover': 'rgba(90, 128, 255, 0.35)',
      ':not(:disabled):active': 'rgba(90, 128, 255, 0.1)',
      ':is([aria-selected=true])': 'rgba(90, 128, 255, 0.1)',
      ':disabled': colors.backgroundSecondary
    },
    color: {
      default: colors.textPrimaryDefault,
      ':not(:disabled):hover': colors.textPrimaryHover,
      ':not(:disabled):active': colors.textPrimaryActive,
      ':is([aria-selected=true])': colors.textPrimaryActive,
      ':disabled': colors.black70
    }
  },
  // size
  lg: {},
  md: {
    borderRadius: 10,
    height: 44,
    padding: '12px 24px'
  },
  sm: {},
  full: {
    width: '100%'
  },
  fit: {
    width: 'fit-content'
  }
});
