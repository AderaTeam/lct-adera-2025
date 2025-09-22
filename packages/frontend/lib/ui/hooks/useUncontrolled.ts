import { useState } from 'react';

interface UseUncontrolledInput<T> {
  value?: T;

  defaultValue?: T;

  finalValue?: T;

  onChange?: (value: T, ...payload: unknown[]) => void;
}

export function useUncontrolled<T>({
  value,
  defaultValue,
  finalValue,
  onChange = () => ({})
}: UseUncontrolledInput<T>): [T, (value: T, ...payload: unknown[]) => void, boolean] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? finalValue);

  const handleUncontrolledChange = (val: T, ...payload: unknown[]) => {
    setUncontrolledValue(val);
    onChange(val, ...payload);
  };

  if (value !== undefined) {
    return [value as T, onChange, true];
  }

  return [uncontrolledValue as T, handleUncontrolledChange, false];
}
