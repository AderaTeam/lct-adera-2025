export const createAuthFetch =
  (apiUrl: string, getToken?: () => Promise<string>) =>
  async <R>(endpoint: string, options?: RequestInit) => {
    const headers = new Headers(options?.headers);
    if (getToken) {
      const accessToken = await getToken();
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    const response = await fetch(apiUrl + endpoint, { ...options, headers });
    if (!response.ok) throw Error(response.statusText);
    return (await response.json()) as Promise<R>;
  };
