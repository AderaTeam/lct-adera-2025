import { ReactNode, useCallback, useState } from 'react';
import * as stylex from '@stylexjs/stylex';
import { ToastOptions } from './Toast.types';
import { ToastContextProvider } from './Toast.context';
import { Toast } from './Toast';

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const showToast = useCallback((toast: Omit<ToastOptions, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContextProvider value={{ showToast, clearToasts }}>
      {children}
      <div {...stylex.props(styles.root)}>
        {toasts.map(({ id, ...toastProps }) => {
          return <Toast onClose={removeToast} key={id} id={id} {...toastProps} />;
        })}
      </div>
    </ToastContextProvider>
  );
};

const styles = stylex.create({
  root: {
    position: 'fixed',
    top: 16,
    right: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    zIndex: 100
  }
});
