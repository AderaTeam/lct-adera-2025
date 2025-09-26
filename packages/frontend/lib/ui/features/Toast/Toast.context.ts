import { createSafeContext } from '../../utils/createSafeContext';
import { ToastOptions } from './Toast.types';

export interface ToastContextValue {
  showToast: (toast: Omit<ToastOptions, 'id'>) => void;

  clearToasts: () => void;
}

export const [ToastContextProvider, useToast] = createSafeContext<ToastContextValue>(
  'Toast component was not found in tree'
);
