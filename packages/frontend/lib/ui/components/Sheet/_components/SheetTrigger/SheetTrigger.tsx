import { ComponentProps, MouseEvent } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { useSheetContext } from '../../Sheet.context';

export interface SheetTriggerProps extends Omit<ComponentProps<'button'>, 'style'> {
  style?: StyleXStyles;
  asChild?: boolean;
}

export function SheetTrigger({ children, style, asChild, onClick }: SheetTriggerProps) {
  const { open, setOpen } = useSheetContext();
  const Component = asChild ? Slot : 'button';

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setOpen(!open);
    onClick?.(e);
  };

  return (
    <Component {...stylex.props(style)} onClick={handleClick}>
      {children}
    </Component>
  );
}
