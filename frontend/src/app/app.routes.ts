import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { AdminComponent } from './components/admin/admin.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { ProductManagementComponent } from './components/admin/product-management/product-management.component';
import { OrderManagementComponent } from './components/admin/order-management/order-management.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/navigation/navigation.component').then(
        (m) => m.NavigationComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./components/product-list/product-list.component').then(
            (m) => m.ProductListComponent
          ),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./components/cart/cart.component').then(
            (m) => m.CartComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/order-history/order-history.component').then(
            (m) => m.OrderHistoryComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./components/wishlist/wishlist.component').then(
            (m) => m.WishlistComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'vouchers',
        loadComponent: () =>
          import('./components/voucher/voucher.component').then(
            (m) => m.VoucherComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: 'admin' },
        children: [
          { path: '', component: AdminComponent },
          {
            path: 'users',
            component: UserManagementComponent,
          },
          {
            path: 'products',
            component: ProductManagementComponent,
          },
          {
            path: 'orders',
            component: OrderManagementComponent,
          },
        ],
      },
    ],
  },
];
