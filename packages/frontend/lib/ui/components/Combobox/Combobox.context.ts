import { createSafeContext } from '@adera/ui/utils/createSafeContext';

export interface ComboboxContextValue {
  open: boolean;

  setOpen: (open: boolean) => void;

  value: string | string[] | null;

  setValue: (value: string | string[] | null) => void;

  multiple?: boolean;

  label: string;

  setLabel: (label: string) => void;

  disabled?: boolean;

  targetElement: HTMLElement | null;

  setTargetElement: (element: HTMLElement | null) => void;

  required?: boolean;
}

export const [ComboboxProvider, useComboboxContext] = createSafeContext<ComboboxContextValue>(
  'Combobox component was not found in tree'
);
