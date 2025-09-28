import { PropsWithChildren, useState } from 'react';
import { useUncontrolled } from '../../../../hooks/useUncontrolled';
import { PopoverDropdown } from './_components/PopoverDropdown';
import { PopoverTarget } from './_components/PopoverTarget';
import { PopoverProvider } from './PopoverContext';

export interface PopoverProps extends PropsWithChildren {
  disabled?: boolean;

  open?: boolean;

  onOpenChange?: (open: boolean) => void;
}

export const Popover = ({ open, onOpenChange, children }: PopoverProps) => {
  const [targetElement, setTargetElement] = useState<null | HTMLElement>(null);

  const [_open, setOpen] = useUncontrolled({
    value: open,
    defaultValue: false,
    finalValue: false,
    onChange: onOpenChange
  });

  return (
    <PopoverProvider value={{ open: _open, setOpen, targetElement, setTargetElement }}>{children}</PopoverProvider>
  );
};

Popover.Target = PopoverTarget;
Popover.Dropdown = PopoverDropdown;
