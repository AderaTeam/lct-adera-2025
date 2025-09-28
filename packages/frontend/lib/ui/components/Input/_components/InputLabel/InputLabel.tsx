import { ComponentProps } from 'react';
import * as stylex from '@stylexjs/stylex';
import { text } from '@adera/ui';
import { colors } from '@adera/ui/tokens.stylex';

export interface InputLabelProps extends ComponentProps<'div'> {
  required?: boolean;

  labelElement?: 'label' | 'div';
}

export const InputLabel = ({ children, required, labelElement = 'label' }: InputLabelProps) => {
  const Component = labelElement;

  return (
    <Component {...stylex.props(styles.root, text.defaultSemibold)}>
      {children}
      {required && '*'}
    </Component>
  );
};

const styles = stylex.create({
  root: {
    color: colors.textPrimaryDefault,
    marginBottom: 6
  }
});
