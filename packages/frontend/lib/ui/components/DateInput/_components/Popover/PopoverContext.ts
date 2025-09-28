import { createSafeContext } from '../../../../utils/createSafeContext';

export interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
  targetElement: HTMLElement | null;
  setTargetElement: (element: HTMLElement | null) => void;
}

export const [PopoverProvider, usePopoverContext] = createSafeContext<PopoverContextValue>(
  'Popover component was not found in tree'
);
