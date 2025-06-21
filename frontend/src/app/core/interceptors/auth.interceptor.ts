import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('HTTP Error in interceptor:', error);
      
      // Handle authentication errors
      if (error.status === 401 || error.status === 403) {
        console.log('Authentication error - redirecting to login');
        authService.logout();
        router.navigate(['/login']);
      }
      
      // Handle CORS errors
      if (error.status === 0) {
        console.error('CORS or network error occurred');
      }
      
      return throwError(() => error);
    })
  );
}; 