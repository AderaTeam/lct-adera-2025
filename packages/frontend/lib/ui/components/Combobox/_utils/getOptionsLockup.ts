import { ComboboxItem } from '../Combobox.types';

export function getOptionsLockup(options: ComboboxItem[]): Record<string, ComboboxItem | undefined> {
  return options.reduce<Record<string, ComboboxItem | undefined>>((acc, item) => {
    acc[item.value] = item;

    return acc;
  }, {});
}
