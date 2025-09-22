import { PropsWithChildren, useState } from 'react';
import { useUncontrolled } from '../../hooks/useUncontrolled';
import { ComboboxHiddenInput } from './_components/ComboboxHiddenInput';
import { ComboboxOption } from './_components/ComboboxOption';
import { ComboboxOptions } from './_components/ComboboxOptions';
import { ComboboxTarget } from './_components/ComboboxTarget';
import { ComboboxProvider } from './Combobox.context';

export interface ComboboxProps extends PropsWithChildren {
  defaultValue?: string | string[] | null;

  value?: string | string[] | null;

  multiple?: boolean;

  onValueChange?: (value: string | string[] | null) => void;

  name?: string;

  disabled?: boolean;

  required?: boolean;

  open?: boolean;

  onOpenChange?: (open: boolean) => void;
}

export function Combobox({
  children,
  defaultValue,
  multiple,
  value,
  onValueChange,
  disabled,
  required,
  open,
  onOpenChange
}: ComboboxProps) {
  const [_value, setValue] = useUncontrolled({
    value,
    defaultValue,
    finalValue: multiple ? [] : null,
    onChange: onValueChange
  });

  const [label, setLabel] = useState<string>('');

  const [targetElement, setTargetElement] = useState<null | HTMLElement>(null);

  const [_open, setOpen] = useUncontrolled({
    value: open,
    defaultValue: false,
    finalValue: false,
    onChange: onOpenChange
  });

  // TODO добавить переключение опций кнопками Up/Down

  return (
    <ComboboxProvider
      value={{
        open: _open,
        setOpen,
        value: _value,
        multiple,
        setValue,
        label,
        setLabel,
        disabled,
        targetElement,
        setTargetElement,
        required
      }}>
      {children}
    </ComboboxProvider>
  );
}

Combobox.Target = ComboboxTarget;
Combobox.Options = ComboboxOptions;
Combobox.Option = ComboboxOption;
Combobox.HiddenInput = ComboboxHiddenInput;
