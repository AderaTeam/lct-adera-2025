import { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { AderaSize } from '@adera/ui/styles/AderaSize';
import { colors } from '@adera/ui/tokens.stylex';
import { IconButtonVariant } from './IconButton.types';

export interface IconButtonProps extends Omit<ComponentProps<'button'>, 'style'> {
  style?: StyleXStyles;

  variant?: IconButtonVariant;

  asChild?: boolean;

  size?: Extract<AderaSize, 'sm' | 'md' | 'lg'>;
}

export const IconButton = ({
  children,
  style,
  asChild,
  size = 'md',
  variant = IconButtonVariant.primary,
  ...props
}: IconButtonProps) => {
  const Component = asChild ? Slot : 'button';

  return (
    <Component {...stylex.props(styles.iconButton, styles[variant], styles[size], style)} {...props}>
      {children}
    </Component>
  );
};

const styles = stylex.create({
  iconButton: {
    alignItems: 'center',
    borderStyle: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    padding: 6,
    transition: 'all 0.2s'
  },
  // sizes
  lg: {
    borderRadius: 12,
    height: 44,
    width: 44
  },
  md: {
    borderRadius: 10,
    height: 40,
    width: 40
  },
  sm: {
    borderRadius: 8,
    height: 32,
    width: 32
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
      ':disabled': colors.backgroundSecondary
    },
    color: {
      default: colors.textTertiaryDefault,
      ':not(:disabled):hover': colors.textTertiaryHover,
      ':not(:disabled):active': colors.textSecondaryActive,
      ':disabled': colors.black70
    }
  }
});
