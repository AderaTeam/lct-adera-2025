export function isAuthError({ message }: Error) {
  return (
    // Invalid access token
    message.includes('access token') ||
    // refresh token: ** not found
    message.includes('refresh token') ||
    // AuthService errors
    message.startsWith('AuthService')
  );
}
