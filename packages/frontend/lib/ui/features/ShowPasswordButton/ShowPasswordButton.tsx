import { ComponentProps } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import { colors } from '../../tokens.stylex';
import HidePasswordIcon from './hide-password.svg?react';
import ShowPasswordIcon from './show-password.svg?react';

export interface ShowPasswordButtonProps extends Omit<ComponentProps<'button'>, 'style'> {
  style?: StyleXStyles;
  isPressed?: boolean;
}

export function ShowPasswordButton({ style, isPressed = false, ...props }: ShowPasswordButtonProps) {
  return (
    <button type={'button'} {...stylex.props(styles.button, style)} {...props}>
      {isPressed ? (
        <HidePasswordIcon {...stylex.props(styles.icon)} />
      ) : (
        <ShowPasswordIcon {...stylex.props(styles.icon)} />
      )}
    </button>
  );
}

const styles = stylex.create({
  button: {
    alignItems: 'center',
    borderStyle: 'none',
    cursor: 'pointer',
    display: 'flex',
    height: 16,
    justifyContent: 'center',
    padding: 0
  },
  icon: {
    color: {
      default: colors.textTertiaryDefault,
      ':hover': colors.textTertiaryHover,
      ':active': colors.textTertiaryActive
    },
    height: 16,
    width: 16
  }
});
