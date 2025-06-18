import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/navigation/navigation.component').then(m => m.NavigationComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./components/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'cart',
        loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent),
        canActivate: [authGuard]
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
      },
      {
        path: 'orders',
        loadComponent: () => import('./components/order-history/order-history.component').then(m => m.OrderHistoryComponent),
        canActivate: [authGuard]
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent),
        canActivate: [authGuard]
      },
      {
        path: 'vouchers',
        loadComponent: () => import('./components/voucher/voucher.component').then(m => m.VoucherComponent),
        canActivate: [authGuard]
      },
      {
        path: 'admin',
        loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
        canActivate: [authGuard, roleGuard],
        data: { role: 'admin' }
      },
      {
        path: 'admin/products',
        loadComponent: () => import('./components/admin/product-management/product-management.component').then(m => m.ProductManagementComponent),
        canActivate: [authGuard, roleGuard],
        data: { role: 'admin' }
      },
      {
        path: 'admin/orders',
        loadComponent: () => import('./components/admin/order-management/order-management.component').then(m => m.OrderManagementComponent),
        canActivate: [authGuard, roleGuard],
        data: { role: 'admin' }
      },
      {
        path: 'admin/users',
        loadComponent: () => import('./components/admin/user-management/user-management.component').then(m => m.UserManagementComponent),
        canActivate: [authGuard, roleGuard],
        data: { role: 'admin' }
      }
    ]
  }
];
