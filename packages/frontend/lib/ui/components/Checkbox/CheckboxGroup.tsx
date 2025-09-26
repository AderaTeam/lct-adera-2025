import { ReactNode, useCallback } from 'react';
import { useUncontrolled } from '../../hooks/useUncontrolled';
import { CheckboxGroupProvider } from './CheckboxGroup.context';

interface CheckboxGroupProps {
  value?: string[];

  defaultValue?: string[];

  onChange?: (values: string[]) => void;

  children: ReactNode;

  name?: string;
}

export function CheckboxGroup({ value, defaultValue = [], onChange, children, name }: CheckboxGroupProps) {
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: [],
    onChange
  });

  const toggleValue = useCallback(
    (val: string) => {
      const newValues = _value.includes(val) ? _value.filter((v) => v !== val) : [..._value, val];

      setValue(newValues);
    },
    [_value, setValue]
  );

  const isChecked = useCallback((val: string) => _value.includes(val), [_value]);

  return (
    <CheckboxGroupProvider value={{ value: _value, toggleValue, isChecked }}>
      {!!name &&
        _value.map((v, index) => <input key={v} type="hidden" value={v} name={`${name}[${index.toString()}]`} />)}{' '}
      {children}
    </CheckboxGroupProvider>
  );
}
