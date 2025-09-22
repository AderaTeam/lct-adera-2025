import { ChangeEventHandler } from 'react';
import * as stylex from '@stylexjs/stylex';
import { useUncontrolled } from '../../hooks/useUncontrolled';
import { InputBaseProps, InputBase } from '../InputBase';

function getDecimalPlaces(inputValue: string | number): number {
  // All digits must be counted, parseFloat precision depends
  // on the number of digits in the input, not only on the decimal scale
  return inputValue.toString().replace('.', '').length;
}

function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(max, Math.max(min, value));
}

export interface NumberInputProps extends Omit<InputBaseProps, 'onChange'> {
  value?: number | string;

  defaultValue?: number | string;

  onChange?: (value: number | string) => void;

  min?: number;

  max?: number;

  hideControls?: boolean;

  clampBehavior?: 'strict' | 'blur' | 'none';

  trimLeadingZeroesOnBlur?: boolean;
}

export const NumberInput = ({
  onBlur,
  max = Number.MAX_SAFE_INTEGER,
  min = Number.MIN_SAFE_INTEGER,
  value,
  defaultValue,
  clampBehavior,
  onChange,
  trimLeadingZeroesOnBlur = true,
  style,
  ...props
}: NumberInputProps) => {
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: '',
    onChange
  });

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    let sanitizedValue = _value;

    if (clampBehavior === 'blur' && typeof sanitizedValue === 'number') {
      const clampedValue = clamp(sanitizedValue, [min, max]);
      sanitizedValue = clampedValue;
    }

    if (trimLeadingZeroesOnBlur && typeof sanitizedValue === 'string' && getDecimalPlaces(sanitizedValue) < 15) {
      const replaced = sanitizedValue.toString().replace(/^0+/, '');
      const parsedValue = parseFloat(replaced);
      sanitizedValue =
        Number.isNaN(parsedValue) || parsedValue > Number.MAX_SAFE_INTEGER ? replaced : clamp(parsedValue, [min, max]);
    }

    if (_value !== sanitizedValue) {
      setValue(sanitizedValue);
    }

    onBlur?.(event);
  };

  return (
    <InputBase
      onChange={handleChange}
      style={[styles.root, style]}
      type="number"
      value={_value}
      onBlur={handleBlur}
      max={max}
      min={min}
      {...props}
    />
  );
};

const styles = stylex.create({
  root: {
    appearance: 'textfield',
    '::-webkit-outer-spin-button': { display: 'none' },
    '::-webkit-inner-spin-button': { display: 'none' }
  }
});
