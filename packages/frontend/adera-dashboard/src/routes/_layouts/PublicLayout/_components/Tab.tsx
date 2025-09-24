import { ReactNode } from 'react';
import { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { NavLink, NavLinkProps } from 'react-router-dom';
import { text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';

export interface TabProps extends Omit<NavLinkProps, 'style' | 'to' | 'onClick'> {
  style?: StyleXStyles;

  disabled?: boolean;

  to?: string;

  onClick?: () => void;
}

export function Tab({ style, children, disabled, onClick, to, ...props }: TabProps) {
  if (disabled || !to)
    return (
      <div {...stylex.props(styles.root, text.defaultMedium, style)} onClick={onClick} aria-disabled={disabled}>
        {children as ReactNode}
      </div>
    );

  return (
    <NavLink {...props} to={to} onClick={onClick} {...stylex.props(styles.root, text.defaultMedium, style)}>
      {children}
    </NavLink>
  );
}

const styles = stylex.create({
  root: {
    backgroundColor: {
      default: 'transparent',
      ':is(:hover):not(:is([aria-disabled=true]), .active)': colors.buttonSecondaryHover,
      ':is(.active)': colors.buttonSecondaryActive,
      ':is([aria-disabled=true])': colors.backgroundSecondary
    },
    borderRadius: 10,
    color: {
      default: colors.textPrimaryDefault,
      ':is(:hover):not(:is([aria-disabled=true]), .active)': colors.textPrimaryHover,
      ':is(.active)': colors.textPrimaryActive,
      ':is([aria-disabled=true])': colors.black70
    },
    cursor: {
      default: 'pointer',
      ':disabled': 'default'
    },
    display: 'inline-flex',
    gap: 8,
    height: 44,
    justifyContent: 'center',
    padding: '12px 24px',
    position: 'relative',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'all 0.2s'
  }
});
