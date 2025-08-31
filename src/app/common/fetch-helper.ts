import { AuthService } from '../auth/auth.service';

export function authFetch(auth: AuthService, input: RequestInfo, init: RequestInit = {}) {
  const token = auth.getToken();
  const headers = new Headers(init.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const cfg = { ...init, headers };
  return fetch(input, cfg);
}
