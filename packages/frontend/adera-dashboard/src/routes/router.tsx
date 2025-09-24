import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import { BaseLayout } from './_layouts/BaseLayout';
import { PublicLayout } from './_layouts/PublicLayout';
import { AnalyticsPage } from './AnalyticsPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route Component={BaseLayout}>
      <Route Component={PublicLayout}>
        <Route path={'/'} Component={AnalyticsPage} />
      </Route>

      {/* not found */}
      <Route path={'*'} Component={() => <Navigate to={'/'} replace />} />
    </Route>
  )
);
