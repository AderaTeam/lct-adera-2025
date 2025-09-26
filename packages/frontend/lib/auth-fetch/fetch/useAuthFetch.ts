import { useContext } from 'react';
import { FetchContext } from './FetchContext';

export function useAuthFetch() {
  const authFetch = useContext(FetchContext);
  if (!authFetch) throw Error('no FetchProvider');
  return authFetch;
}
