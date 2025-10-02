import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { AuthFetchProvider } from '@adera/auth-fetch';
import { ErrorBoundary, AppErrorScreen } from 'features/ErrorBoundary';
import { router } from 'routes/router';
import { apiUrl } from 'store/config';
import { queryClient } from 'store/queryClient';

export function App() {
  return (
    <ErrorBoundary fallback={() => <AppErrorScreen />}>
      <QueryClientProvider client={queryClient}>
        <AuthFetchProvider apiUrl={apiUrl}>
          <Suspense>
            <RouterProvider router={router} />
          </Suspense>
        </AuthFetchProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
