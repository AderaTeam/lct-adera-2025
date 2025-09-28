import { ComponentProps, MouseEventHandler } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { useComboboxContext } from '../../Combobox.context';

export interface ComboboxTargetProps extends Omit<ComponentProps<'button'>, 'style'> {
  asChild?: boolean;
  style?: StyleXStyles;
}

export function ComboboxTarget({ children, style, asChild, ...props }: ComboboxTargetProps) {
  const { open, setOpen, disabled, setTargetElement } = useComboboxContext();
  const Component = asChild ? Slot : 'button';

  const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (e) => {
    const target = e.target as HTMLElement;

    // Проверяем, был ли клик внутри элемента с data-target-ignored
    if (target.closest('[data-target-ignored]')) return;

    setOpen(true);
  };

  return (
    <Component
      {...stylex.props(style)}
      onMouseDown={handleMouseDown}
      disabled={disabled}
      role={'combobox'}
      data-disabled={disabled}
      data-state={open ? 'open' : 'closed'}
      ref={(el) => {
        setTargetElement(el);
      }}
      {...props}>
      {children}
    </Component>
  );
}
