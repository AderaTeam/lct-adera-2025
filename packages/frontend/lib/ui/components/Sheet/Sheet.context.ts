import { createSafeContext } from '@adera/ui/utils/createSafeContext';

export interface SheetContext {
  open: boolean;

  setOpen: (open: boolean) => void;

  unmount?: boolean;

  closeOnClickOutside?: boolean;
}

export const [SheetProvider, useSheetContext] = createSafeContext<SheetContext>(
  'Sheet component was not found in the tree'
);
