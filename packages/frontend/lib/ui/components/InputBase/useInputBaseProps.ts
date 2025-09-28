import { InputBaseProps } from './InputBase';

export const useInputBaseProps = (props: InputBaseProps) => {
  const {
    rightSection,
    leftSection,
    size,
    style,
    description,
    label,
    inputWrapperOrder,
    validate,
    required,
    children,
    onErrorChange,
    error,
    ...rest
  } = props;

  return {
    inputProps: { rightSection, leftSection, size, style, required, ...rest },
    wrapperProps: { description, label, inputWrapperOrder, required, size, validate, children, onErrorChange, error }
  };
};
