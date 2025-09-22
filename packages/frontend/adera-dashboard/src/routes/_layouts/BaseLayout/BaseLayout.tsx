import { Outlet, ScrollRestoration } from 'react-router-dom';
import s from './BaseLayout.module.scss';

export function BaseLayout() {
  return (
    <div className={s.BaseLayout}>
      <ScrollRestoration />
      <Outlet />
    </div>
  );
}
