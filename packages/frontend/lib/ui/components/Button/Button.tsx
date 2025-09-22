import { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import { text } from '@adera/ui';
import { AderaSize } from '@adera/ui/styles/AderaSize';
import { colors } from '@adera/ui/tokens.stylex';
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
      ':disabled': colors.backgroundNeutralDefault
    },
    color: {
      default: 'white',
      ':disabled': colors.black30
    }
  },
  secondary: {
    backgroundColor: {
      default: 'white',
      ':disabled': colors.backgroundNeutralDefault
    },
    borderColor: {
      default: colors.outlinePrimaryDefault,
      ':not(:disabled):hover': colors.outlinePrimaryHover,
      ':not(:disabled):active': colors.outlinePrimaryActive,
      ':disabled': 'transparent'
    },
    borderStyle: 'solid',
    color: {
      default: colors.textPrimaryDefault,
      ':disabled': colors.black30
    }
  },
  accent: {
    backgroundColor: {
      default: colors.buttonAccentDefault,
      ':not(:disabled):hover': colors.buttonAccentHover,
      ':not(:disabled):active': colors.buttonAccentActive,
      ':disabled': colors.backgroundNeutralDefault
    },
    color: {
      default: 'white',
      ':disabled': colors.black30
    }
  },
  accentSecondary: {
    backgroundColor: {
      default: colors.buttonSecondaryAccentDefault,
      ':not(:disabled):hover': colors.buttonSecondaryAccentHover,
      ':not(:disabled):active': colors.buttonSecondaryAccentActive,
      ':disabled': colors.backgroundNeutralDefault
    },
    color: {
      default: colors.brand90,
      ':not(:disabled):hover': colors.brand70,
      ':not(:disabled):active': colors.brand80,
      ':disabled': colors.black30
    }
  },
  tertiarySecondary: {
    backgroundColor: {
      default: colors.buttonTertiaryAccentDefault,
      ':not(:disabled):hover': colors.buttonTertiaryAccentHover,
      ':not(:disabled):active': colors.buttonTertiaryAccentActive,
      ':disabled': colors.backgroundNeutralDefault
    },
    color: {
      default: colors.blue80,
      ':not(:disabled):hover': colors.blue70,
      ':not(:disabled):active': colors.blue90,
      ':disabled': colors.black30
    }
  },
  ghost: {
    backgroundColor: {
      default: 'transparent',
      ':not(:disabled):hover': colors.backgroundNeutralHover,
      ':disabled': colors.backgroundNeutralDefault
    },
    color: {
      default: colors.textPrimaryDefault,
      ':not(:disabled):hover': colors.textPrimaryHover,
      ':not(:disabled):active': colors.textPrimaryActive,
      ':disabled': colors.black30
    }
  },
  // size
  lg: {},
  md: {
    borderRadius: 8,
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
