import { ReactNode, useMemo } from 'react';
import { createAuthFetch } from './createAuthFetch';
import { FetchContext } from './FetchContext';

export function FetchProvider({ apiUrl, children }: { apiUrl: string; children?: ReactNode }) {
  const fetchClient = useMemo(() => {
    return createAuthFetch(apiUrl, undefined);
  }, [apiUrl]);

  return <FetchContext.Provider value={fetchClient}>{children}</FetchContext.Provider>;
}
