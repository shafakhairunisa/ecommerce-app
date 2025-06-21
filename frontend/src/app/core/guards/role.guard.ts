import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRole = route.data?.['role']?.toLowerCase();
  const user = authService.currentUserValue;
  const userRole = user?.role?.toLowerCase();
  
  if (user && userRole === requiredRole) {
    return true;
  }
  
  // Redirect to appropriate page based on role
  if (user) {
    // Convert role to lowercase for case-insensitive comparison
    if (userRole === 'admin') {
      router.navigate(['/admin']);
    } else if (userRole === 'customer') {
      router.navigate(['/products']);
    } else {
      // Default fallback
      router.navigate(['/home']);
    }
  } else {
    router.navigate(['/registration']);
  }
  
  return false;
}; 