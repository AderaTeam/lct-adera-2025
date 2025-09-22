import { InputBaseProps, InputBase } from '../InputBase';

export type TextInputProps = InputBaseProps;

export const TextInput = (props: TextInputProps) => {
  return <InputBase {...props} />;
};
