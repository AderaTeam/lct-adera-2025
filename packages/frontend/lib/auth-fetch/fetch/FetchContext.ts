import { createContext } from 'react';

export type AuthFetch = <R>(endpoint: string, options?: RequestInit) => Promise<R>;
export const FetchContext = createContext<AuthFetch | null>(null);
