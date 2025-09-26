import { ReactNode } from 'react';
import { FetchProvider } from './fetch';

export function AuthFetchProvider({ apiUrl, children }: { apiUrl: string; children?: ReactNode }) {
  return <FetchProvider apiUrl={apiUrl}>{children}</FetchProvider>;
}
