export enum ToastStatus {
  good = 'good',
  info = 'info',
  bad = 'bad'
}

export interface ToastOptions {
  id: string;

  title: string;

  description?: string;

  status?: ToastStatus;

  withCloseButton?: false;
}
