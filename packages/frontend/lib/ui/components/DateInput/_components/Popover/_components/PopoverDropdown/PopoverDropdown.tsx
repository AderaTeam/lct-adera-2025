import { ComponentProps, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import { createPortal } from 'react-dom';
import { usePopoverContext } from '../../PopoverContext';

export interface PopoverDropdownProps extends Omit<ComponentProps<'div'>, 'style'> {
  asChild?: boolean;

  style?: StyleXStyles;
}

export function PopoverDropdown(props: PopoverDropdownProps) {
  const { open } = usePopoverContext();
  const [fragment, setFragment] = useState<DocumentFragment>();

  useLayoutEffect(() => {
    setFragment(new DocumentFragment());
  }, []);

  if (!open) {
    const frag = fragment as Element | undefined;
    return frag ? createPortal(<div>{props.children}</div>, frag) : null;
  }

  return <PopoverDropdownImpl {...props} />;
}

function PopoverDropdownImpl({ children, style, asChild, ...props }: PopoverDropdownProps) {
  const { open, setOpen, targetElement } = usePopoverContext();
  const ref = useRef<HTMLDivElement>(null);
  const Component = asChild ? Slot : 'div';

  const [dropUp, setDropUp] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);

  const [position, setPosition] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;

      if (!target?.isConnected || target.closest('[data-target-ignored]')) return;

      if (ref.current && !ref.current.contains(target) && !targetElement?.contains(target)) {
        setOpen(false);
      }
    };

    let active = true;
    setTimeout(() => {
      if (active) {
        window.addEventListener('mousedown', handleClick);
        window.addEventListener('touchstart', handleClick);
      }
    }, 0);

    return () => {
      active = false;
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('touchstart', handleClick);
    };
  }, [ref, targetElement, setOpen]);

  useEffect(() => {
    if (!ref.current || !targetElement) return;

    const updatePosition = () => {
      if (!ref.current) return;

      const height = ref.current.offsetHeight;
      setDropdownHeight(height);

      const position = targetElement.getBoundingClientRect();
      const spaceBelow = window.innerHeight - position.bottom;
      setDropUp(spaceBelow < height + 4);
      setPosition(position); // обновляем позицию
    };

    const observer = new ResizeObserver(updatePosition);
    observer.observe(ref.current);

    window.addEventListener('scroll', updatePosition, true); // true — чтобы ловить скрол в родителях
    window.addEventListener('resize', updatePosition);

    // Первая установка при монтировании
    requestAnimationFrame(updatePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [targetElement]);

  if (!targetElement) {
    throw new Error('There must be a target element');
  }

  useEffect(() => {
    const rect = targetElement.getBoundingClientRect();
    setPosition(rect);
  }, [targetElement]);

  const top = dropUp
    ? (position?.top ?? 0) + window.scrollY - dropdownHeight - 4
    : (position?.top ?? 0) + (position?.height ?? 0) + window.scrollY + 4;
  const left = position?.left ?? 0;

  const element = (
    <Component
      {...stylex.props(styles.root(top, left, !dropdownHeight ? 0 : 1), style)}
      ref={ref}
      data-state={open ? 'open' : 'closed'}
      {...props}>
      {children}
    </Component>
  );

  const containerElement = document.getElementById('root');
  if (!containerElement) {
    throw new Error('Your app must has #root element');
  }

  return <>{createPortal(element, containerElement)}</>;
}

const styles = stylex.create({
  root: (top: number, left: number, opacity: number) => ({
    boxShadow: '0px 4px 4px 0px #383E490A, 0px 8px 24px 0px #383E491F',
    left,
    opacity,
    position: 'absolute',
    top,
    visibility: {
      default: 'visible'
      //':not(:has(> [role="content"]))': 'hidden'
    },
    zIndex: 30
  })
});
