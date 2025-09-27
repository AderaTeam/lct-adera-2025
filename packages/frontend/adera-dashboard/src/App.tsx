import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { AuthFetchProvider, ErrorBoundary } from '@adera/auth-fetch';
import { router } from 'routes/router';
import { apiUrl } from 'store/config';
import { queryClient } from 'store/queryClient';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthFetchProvider apiUrl={apiUrl}>
        <ErrorBoundary errorElement={() => <div>error</div>}>
          <Suspense>
            <RouterProvider router={router} />
          </Suspense>
        </ErrorBoundary>
      </AuthFetchProvider>
    </QueryClientProvider>
  );
}
