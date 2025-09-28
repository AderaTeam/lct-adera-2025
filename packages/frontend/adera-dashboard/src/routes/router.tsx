import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom';
import { BaseLayout } from './_layouts/BaseLayout';
import { PublicLayout } from './_layouts/PublicLayout';
import { AnalyticsPage } from './AnalyticsPage';
import { UploadAnalysisPage } from './UploadAnalysisPage';
import { UploadPage } from './UploadPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route Component={BaseLayout}>
      <Route Component={PublicLayout}>
        <Route path={'/'} Component={AnalyticsPage} />
        <Route path={'/upload'} Component={UploadPage} />
        <Route path={'/upload/:id'} Component={UploadAnalysisPage} />
      </Route>

      {/* not found */}
      <Route path={'*'} Component={() => <Navigate to={'/'} replace />} />
    </Route>
  )
);
