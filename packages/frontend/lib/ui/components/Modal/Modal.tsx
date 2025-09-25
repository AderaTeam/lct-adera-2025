import { ComponentProps, Fragment, ReactNode, useEffect, useRef } from 'react';
import * as stylex from '@stylexjs/stylex';
import { StyleXStyles } from '@stylexjs/stylex';
import { createPortal } from 'react-dom';
import { useUncontrolled } from '../../hooks/useUncontrolled';
import { colors } from '../../tokens.stylex';
import { XIcon } from '../Icon';
import { IconButton, IconButtonVariant } from '../IconButton';
import { ModalProvider, useModalContext } from './Modal.context';

interface ModalProps {
  children?: ReactNode;

  withOverlay?: boolean;

  withCloseButton?: boolean;

  open?: boolean;

  onOpenChange?: (open: boolean) => void;
}

export const Modal = ({ withOverlay = true, withCloseButton = true, open, onOpenChange, children }: ModalProps) => {
  const [_open, setOpen] = useUncontrolled({
    value: open,
    defaultValue: false,
    finalValue: false,
    onChange: onOpenChange
  });

  const scrollYRef = useRef(0);

  useEffect(() => {
    if (_open) {
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
  }, [_open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ModalProvider value={{ open: handleOpen, close: handleClose, withOverlay, withCloseButton, openState: _open }}>
      {children}
    </ModalProvider>
  );
};

interface ModalComponentProps extends Omit<ComponentProps<'div'>, 'style'> {
  style?: StyleXStyles;
}

const ModalContent = ({ children, style }: ModalComponentProps) => {
  const ctx = useModalContext();

  if (!ctx.openState) return null;

  const Modal = (
    <div {...stylex.props(styles.wrapper)}>
      {ctx.withOverlay && <div {...stylex.props(styles.overlay)} onClick={ctx.close} />}
      <div
        {...stylex.props(styles.content, style)}
        onClick={(e) => {
          e.stopPropagation();
        }}>
        {children}
      </div>
    </div>
  );

  return <Fragment>{createPortal(Modal, document.body)}</Fragment>;
};

const ModalTarget = ({ style, children, ...props }: ModalComponentProps) => {
  const ctx = useModalContext();

  return (
    <div {...props} onClick={ctx.open} {...stylex.props(style)}>
      {children}
    </div>
  );
};

const ModalHeader = ({ style, children, ...props }: ModalComponentProps) => {
  const ctx = useModalContext();

  return (
    <div {...props} {...stylex.props(styles.header, style)}>
      {children}
      {ctx.withCloseButton && (
        <IconButton variant={IconButtonVariant.ghost} size="sm" onClick={ctx.close}>
          <XIcon />
        </IconButton>
      )}
    </div>
  );
};

/**
 * TODO:
 * Title
 * Overlay
 */
Modal.Content = ModalContent;
Modal.Target = ModalTarget;
Modal.Header = ModalHeader;

const styles = stylex.create({
  overlay: {
    backdropFilter: 'blur(4px)',
    backgroundColor: 'rgba(18, 18, 30, 0.9)',
    inset: 0,
    position: 'fixed',
    zIndex: 10
  },
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    inset: 0,
    justifyContent: 'center',
    position: 'fixed',
    zIndex: 20
  },
  content: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    color: colors.textPrimaryDefault,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    maxWidth: 670,
    paddingBlock: 20,
    paddingInline: 30,
    position: 'relative',
    width: '100%',
    zIndex: 10
  },
  header: {
    alignItems: 'flex-start',
    display: 'flex',
    justifyContent: 'space-between',
    paddingBlock: 20,
    paddingInline: 16
  }
});
