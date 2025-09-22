import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import { createPortal } from 'react-dom';
import { colors } from '@adera/ui/tokens.stylex';
import { InfiniteScroll, InfiniteScrollProps } from '../../../InfiniteScroll';
import { useComboboxContext } from '../../Combobox.context';

export interface ComboboxOptionsProps extends InfiniteScrollProps {
  asChild?: boolean;

  style?: StyleXStyles;
}

export function ComboboxOptions(props: ComboboxOptionsProps) {
  const { open } = useComboboxContext();
  const [fragment, setFragment] = useState<DocumentFragment>();

  useLayoutEffect(() => {
    setFragment(new DocumentFragment());
  }, []);

  if (!open) {
    const frag = fragment as Element | undefined;
    return frag ? createPortal(<div>{props.children}</div>, frag) : null;
  }

  return <ComboboxOptionsImpl {...props} />;
}

function ComboboxOptionsImpl({ children, style, ...props }: ComboboxOptionsProps) {
  const { open, setOpen, targetElement, value } = useComboboxContext();

  const ref = useRef<HTMLDivElement>(null);

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
  }, [value, targetElement]);

  const top = dropUp
    ? (position?.top ?? 0) + window.scrollY - dropdownHeight - 4
    : (position?.top ?? 0) + (position?.height ?? 0) + window.scrollY + 4;

  const left = position?.left ?? 0;
  const width = position?.width ?? 'auto';

  const element = (
    <InfiniteScroll
      {...stylex.props(styles.root(top, left, width, !dropdownHeight ? 0 : 1), style)}
      ref={ref}
      data-state={open ? 'open' : 'closed'}
      {...props}>
      {children}
    </InfiniteScroll>
  );

  const containerElement = document.getElementById('root');
  if (!containerElement) {
    throw new Error('Your app must has #root element');
  }

  return <>{createPortal(element, containerElement)}</>;
}

const styles = stylex.create({
  root: (top: number | string, left: number, width: number | string, opacity: number) => ({
    backgroundColor: 'white',
    borderColor: colors.outlineAccentDefault,
    borderRadius: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: '0px 4px 4px 0px #383E490A, 0px 8px 24px 0px #383E491F',
    left,
    maxHeight: 176,
    opacity,
    overflow: 'hidden',
    overflowY: 'auto',
    position: 'absolute',
    top,
    visibility: { default: 'visible', ':not(:has(> [role="option"]))': 'hidden' },
    width,
    zIndex: 150,
    '::-webkit-scrollbar': { background: 'transparent', display: 'none', height: 0, width: 0 }
  })
});
