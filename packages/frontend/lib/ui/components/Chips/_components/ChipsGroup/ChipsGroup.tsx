import * as stylex from '@stylexjs/stylex';
import { useUncontrolled, Flex, Input, InputWrapperProps } from '@adera/ui';
import { ChipsGroupProvider } from './ChipsGroup.context';

export interface ChipsGroupProps extends InputWrapperProps {
  value?: string | string[];

  onChange?: (value: string | string[]) => void;

  defaultValue?: string | string[];

  multiple?: boolean;

  name?: string;
}

export const ChipsGroup = ({
  value,
  onChange,
  defaultValue,
  label,
  children,
  required,
  multiple,
  name,
  ...props
}: ChipsGroupProps) => {
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: multiple ? [] : '',
    onChange
  });

  return (
    <Input.Wrapper>
      {!!label && (
        <Input.Label style={styles.label} required={required}>
          {label}
        </Input.Label>
      )}
      <ChipsGroupProvider value={{ value: _value, setValue, multiple }}>
        <Flex gap={8} rowGap={8} {...props}>
          {children}
        </Flex>
      </ChipsGroupProvider>

      {!!name && <input type="hidden" name={name} value={Array.isArray(_value) ? _value.join(',') : _value} />}
    </Input.Wrapper>
  );
};

const styles = stylex.create({
  label: {
    marginBottom: 12
  }
});
