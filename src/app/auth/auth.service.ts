import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResult {
  token: string;
  username: string;
}

@Injectable()
export class AuthService {
  private _tokenKey = 'arithmetic_token';
  private _usernameKey = 'arithmetic_username';
  public username$ = new BehaviorSubject<string | null>(this.getUsername());

  private base = environment.baseApiUrl;

  getToken(): string | null {
    return localStorage.getItem(this._tokenKey);
  }
  private getUsername(): string | null {
    return localStorage.getItem(this._usernameKey);
  }
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  
  async login(username: string, password: string): Promise<LoginResult> {
    const res = await fetch(`${this.base}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || 'Login failed');
    }
    const data = await res.json() as LoginResult;
    localStorage.setItem(this._tokenKey, data.token);
    localStorage.setItem(this._usernameKey, data.username);
    this.username$.next(data.username);
    return data;
  }

    async register(username: string, password: string, email?: string) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json'
        };

        const auth = this.authHeader();
        if (auth) {
            headers['Authorization'] = auth;
        }

    const res = await fetch(`${this.base}/Auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ username, password, email })
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  }

  logout() {
    localStorage.removeItem(this._tokenKey);
    localStorage.removeItem(this._usernameKey);
    this.username$.next(null);
  }

authHeader(): string | null {
  const t = this.getToken();
  return t ? `Bearer ${t}` : null;
}


  async changePassword(oldPassword: string, newPassword: string) {
    // adapt endpoint if your .NET API has one; otherwise you can create /Auth/change-password
    const res = await fetch(`${this.base}/Auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authHeader() || ''
      },
      body: JSON.stringify({ oldPassword, newPassword })
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  }
}
