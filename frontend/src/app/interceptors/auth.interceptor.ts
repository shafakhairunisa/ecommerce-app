import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Only add token to non-auth endpoints to avoid circular auth issues
  if (
    token &&
    !req.url.includes('/auth/login') &&
    !req.url.includes('/auth/register')
  ) {
    console.log(`Adding authorization header to request: ${req.url}`);
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
