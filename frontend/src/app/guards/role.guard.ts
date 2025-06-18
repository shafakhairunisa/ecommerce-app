import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    console.log('Not authenticated, redirecting to login');
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data['role'];

  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      if (!user) {
        console.log('No user found, redirecting to login');
        router.navigate(['/login']);
        return false;
      }

      console.log(`Required role: ${requiredRole}, User role: ${user.role}`);

      if (requiredRole && user.role !== requiredRole) {
        console.log('Insufficient permissions, redirecting to home');
        router.navigate(['/']);
        return false;
      }

      console.log('Role guard passed');
      return true;
    })
  );
};
