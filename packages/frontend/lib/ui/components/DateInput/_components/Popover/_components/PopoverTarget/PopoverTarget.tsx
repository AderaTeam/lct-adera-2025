import { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { usePopoverContext } from '../../PopoverContext';

export interface PopoverTargetProps extends Omit<ComponentProps<'button'>, 'style'> {
  asChild?: boolean;
  style?: StyleXStyles;
}

export const PopoverTarget = ({ children, style, asChild, ...props }: PopoverTargetProps) => {
  const { open, setOpen, disabled, setTargetElement } = usePopoverContext();
  const Component = asChild ? Slot : 'button';

  const handleMouseDown = () => {
    setOpen(true);
  };

  return (
    <Component
      {...stylex.props(style)}
      onMouseDown={handleMouseDown}
      disabled={disabled}
      role={'Popover'}
      data-disabled={disabled}
      data-state={open ? 'open' : 'closed'}
      ref={(el) => {
        setTargetElement(el);
      }}
      {...props}>
      {children}
    </Component>
  );
};
