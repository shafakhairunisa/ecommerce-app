import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getUserFromStorage()
    );
    this.currentUser = this.currentUserSubject.asObservable();
    
    // Check token expiration on service initialization
    const token = this.getToken();
    if (token) {
      this.handleTokenExpiration(token);
    }
  }

    getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/profile`).pipe(
      catchError(this.handleError)
    );
  }

  updateProfile(profileData: any): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/profile`, profileData).pipe(
      tap((user: User) => {
        // Update the stored user data
        const currentUser = this.currentUserValue;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...user };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.currentUserSubject.next(updatedUser);
        }
      }),
      catchError(this.handleError)
    );
  }

   changePassword(passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/password`, passwordData).pipe(
      catchError(this.handleError)
    );
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}${environment.auth.loginUrl}`, request)
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
        }),
        catchError(this.handleError)
      );
  }

  adminLogin(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/api/auth/admin/login`, request)
      .pipe(
        tap(response => {
          if (response.token) {
            this.handleAuthentication(response);
          }
        }),
        catchError(this.handleError)
      );
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}${environment.auth.registerUrl}`, request)
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
        }),
        catchError(this.handleError)
      );
  }

  private handleAuthentication(response: AuthResponse) {
    const token = response.token;
    localStorage.setItem('token', token);
    
    try {
      const decodedToken: any = jwtDecode(token);
      const user: User = {
        username: decodedToken.sub,
        email: decodedToken.email,
        role: decodedToken.role,
        userId: decodedToken.userId
      };
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      
      // Set up auto logout when token expires
      this.handleTokenExpiration(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout();
    }
  }

  private handleTokenExpiration(token: string) {
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      const now = new Date();
      
      if (expirationDate > now) {
        const timeUntilExpiration = expirationDate.getTime() - now.getTime();
        this.setAutoLogout(timeUntilExpiration);
      } else {
        this.logout();
      }
    } catch {
      this.logout();
    }
  }

  private setAutoLogout(duration: number) {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    // Don't automatically navigate - let the calling code decide where to go
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      return expirationDate > new Date();
    } catch {
      return false;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Cannot connect to server. Is the backend running?';
      } else if (error.status === 401) {
        errorMessage = 'Authentication failed. Invalid username or password.';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid request data';
      } else if (error.status === 409) {
        errorMessage = 'Username or email already exists';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error('Auth Service Error:', errorMessage, error);
    return throwError(() => errorMessage);
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role || null;  // Return null if role doesn't exist
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

}