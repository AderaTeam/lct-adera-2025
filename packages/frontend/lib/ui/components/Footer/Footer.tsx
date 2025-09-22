import { ComponentProps } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import { colors } from '@adera/ui/tokens.stylex';

interface FooterPropps extends Omit<ComponentProps<'footer'>, 'style'> {
  style?: StyleXStyles;
}

export const Footer = ({ children, style, ...props }: FooterPropps) => {
  return (
    <footer {...props} {...stylex.props(styles.root, style)}>
      {children}
    </footer>
  );
};

const styles = stylex.create({
  root: {
    background: 'white',
    borderTopColor: colors.outlinePrimaryDefault,
    borderTopStyle: 'solid',
    borderTopWidth: '1px',
    bottom: 0,
    boxShadow: '0 -20px 20px -15px rgb(0 0 0 / 5%)',
    height: 68,
    left: 0,
    position: 'fixed',
    width: '100%',
    zIndex: 1
  }
});
