import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  admin: boolean;
}

export interface AuthError {
  message: string;
  status: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = localStorage.getItem('user');
    if (token && user && user !== 'undefined') {
      this.currentUserSubject.next(JSON.parse(user));
    } else {
      this.currentUserSubject.next(null);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage =
        error.error?.message || `Server returned code ${error.status}`;

      // Add detailed logging
      console.error('Server error details:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        error: error.error,
      });
    }

    return throwError(() => ({
      message: errorMessage,
      status: error.status,
    }));
  }

  login(username: string, password: string): Observable<AuthResponse> {
    // Create proper headers for JSON content
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    console.log(`Sending login request to: ${this.apiUrl}/login`);
    console.log('Request payload:', { username, password: '***' });

    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        { username, password },
        { headers }
      )
      .pipe(
        tap((response) => {
          console.log('Auth response:', response);
          localStorage.setItem(this.TOKEN_KEY, response.token);

          // Create user object from response
          const user = {
            id: 0,
            name: response.username,
            email: username.includes('@') ? username : '',
            role: response.admin ? 'admin' : 'user',
          };

          // Store user in localStorage
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('role', user.role);

          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }

  register(
    name: string,
    email: string,
    password: string,
    adminKey?: string
  ): Observable<AuthResponse> {
    const payload: any = { username: name, email, password, address: '' };
    if (adminKey) {
      payload.adminKey = adminKey;
    }
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, payload)
      .pipe(
        tap((response) => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          const user = {
            id: 0,
            name: response.username,
            email: '',
            role: response.admin ? 'admin' : 'user',
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  updateProfile(name: string, email: string): Observable<User> {
    return this.http
      .patch<User>(`${this.apiUrl}/profile`, { name, email })
      .pipe(
        tap((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  changePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword,
    });
  }
}
