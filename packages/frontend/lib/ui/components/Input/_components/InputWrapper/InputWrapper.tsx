import { PropsWithChildren, Fragment, ReactNode } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import { useUncontrolled } from '@adera/ui/hooks/useUncontrolled';
import { AderaSize } from '@adera/ui/styles/AderaSize';
import { InputDescription } from '../InputDescription';
import { InputLabel } from '../InputLabel';
import { InputWrapperProvider } from './InputWrapper.context';

export interface InputWrapperProps extends PropsWithChildren {
  description?: string;

  label?: ReactNode;

  inputWrapperOrder?: ('label' | 'input' | 'description')[];

  required?: boolean;

  style?: StyleXStyles;

  size?: Extract<AderaSize, 'md' | 'lg'>;

  // custom validation function => errorMessage || null
  validate?: (value: string, validity: ValidityState) => string | null;

  error?: string | null;

  onErrorChange?: (error: string | null) => void;
}

export const InputWrapper = ({
  label,
  description,
  children,
  inputWrapperOrder = ['label', 'input', 'description'],
  required,
  style,
  validate,
  error,
  onErrorChange,
  size = 'md'
}: InputWrapperProps) => {
  const [_error, setError] = useUncontrolled({
    value: error,
    defaultValue: '',
    onChange: onErrorChange,
    finalValue: ''
  });

  const _input = <Fragment key="input">{children}</Fragment>;

  const _label = !!label && (
    <InputLabel key="label" required={required}>
      {label}
    </InputLabel>
  );

  const _description = (!!description || !!_error) && (
    <InputDescription error={_error} key="description">
      {description}
    </InputDescription>
  );

  const content = inputWrapperOrder.map((part) => {
    switch (part) {
      case 'label':
        return _label;
      case 'input':
        return _input;
      case 'description':
        return _description;
      default:
        return null;
    }
  });

  return (
    <InputWrapperProvider value={{ size, error: _error, setError, validate }}>
      <div {...stylex.props(styles.root, style)}>{content}</div>
    </InputWrapperProvider>
  );
};

const styles = stylex.create({
  root: {
    display: 'flex',
    flex: '1',
    flexDirection: 'column',
    gap: 0,
    width: '100%'
  }
});
