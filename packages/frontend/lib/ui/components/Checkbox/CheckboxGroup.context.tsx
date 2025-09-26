import { createOptionalContext } from '../../utils/createOptionalContext';

interface CheckboxGroupContextValue {
  value: string[];

  toggleValue: (value: string) => void;

  isChecked: (value: string) => boolean;
}

export const [CheckboxGroupProvider, useCheckboxGroup] = createOptionalContext<CheckboxGroupContextValue>({
  value: [],
  toggleValue: () => {
    /* empty */
  },
  isChecked: () => false
});
