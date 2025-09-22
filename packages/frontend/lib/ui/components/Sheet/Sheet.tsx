import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { SheetClose } from './_components/SheetClose';
import { SheetContent } from './_components/SheetContent';
import { SheetFooter } from './_components/SheetFooter';
import { SheetHeader } from './_components/SheetHeader';
import { SheetOverlay } from './_components/SheetOverlay';
import { SheetTrigger } from './_components/SheetTrigger';
import { SheetProvider } from './Sheet.context';

export interface SheetProps {
  defaultOpen?: boolean;

  open?: boolean;

  onOpenChange?: (open: boolean) => void;
  /**
   * Отрисовывать оверлей пот открытии.
   * По умолчанию true
   */
  withOverlay?: boolean;
  /**
   * Удаление компонента из DOM при закрытии.
   * По умолчанию true
   */
  unmount?: boolean;
  /**
   * Определяет, должен ли компонент закрываться,
   * когда пользователь щелкает по оверлею
   * По умолчанию true
   */
  closeOnClickOutside?: boolean;
}

export function Sheet({
  children,
  defaultOpen,
  open: openProp,
  onOpenChange,
  withOverlay = true,
  unmount,
  closeOnClickOutside = true
}: PropsWithChildren<SheetProps>) {
  const [open, setOpenState] = useState(defaultOpen ?? openProp ?? false);

  useEffect(() => {
    if (typeof openProp === 'boolean') {
      setOpenState(openProp);
    }
  }, [openProp]);

  const setOpen = useCallback(
    (open: boolean) => {
      setOpenState(open);
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  const scrollYRef = useRef(0);

  useEffect(() => {
    if (open) {
      scrollYRef.current = window.scrollY;

      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflowY = 'hidden';
      document.body.style.width = `calc(100% - ${scrollBarWidth.toString()}px)`;
    } else {
      // Восстанавливаем прокрутку перед сбросом стилей
      window.scrollTo(0, scrollYRef.current);

      // Очищаем стили
      document.body.style.overflowY = '';
      document.body.style.width = '';
    }

    return () => {
      // Очистка при размонтировании (на всякий случай)
      document.body.style.overflowY = '';
      document.body.style.width = '';
    };
  }, [open]);

  return (
    <SheetProvider value={{ open, setOpen, unmount, closeOnClickOutside }}>
      {!!withOverlay && <SheetOverlay />}
      {children}
    </SheetProvider>
  );
}

Sheet.Trigger = SheetTrigger;
Sheet.Content = SheetContent;
Sheet.Header = SheetHeader;
Sheet.Overlay = SheetOverlay;
Sheet.Close = SheetClose;
Sheet.Footer = SheetFooter;
