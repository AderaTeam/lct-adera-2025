import { InputWrapperProps, Input } from '../Input';
import { InputProps } from '../Input/Input';
import { useInputBaseProps } from './useInputBaseProps';

export type InputBaseProps = InputProps & InputWrapperProps;

export const InputBase = ({ ...props }: InputBaseProps) => {
  const { inputProps, wrapperProps } = useInputBaseProps(props);

  return (
    <Input.Wrapper {...wrapperProps}>
      <Input {...inputProps} />
    </Input.Wrapper>
  );
};
