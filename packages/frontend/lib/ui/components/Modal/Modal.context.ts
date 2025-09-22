import { createSafeContext } from '@adera/ui/utils/createSafeContext';

export interface ModalContextValue {
  open: () => void;

  close: () => void;

  withOverlay: boolean;

  withCloseButton: boolean;

  openState: boolean;
}

export const [ModalProvider, useModalContext] = createSafeContext<ModalContextValue>(
  'Modal component was not found in tree'
);
