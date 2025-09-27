import { Outlet, ScrollRestoration } from 'react-router-dom';
import { ToastProvider } from '@adera/ui';
import s from './BaseLayout.module.scss';

export function BaseLayout() {
  return (
    <div className={s.BaseLayout}>
      <ToastProvider>
        <ScrollRestoration />
        <Outlet />
      </ToastProvider>
    </div>
  );
}
