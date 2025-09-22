export const basename = import.meta.env.BASE_URL;
export const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? `${basename}/api`;
