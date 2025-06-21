import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegistrationComponent } from './features/auth/registration/registration.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './features/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './features/admin/admin-orders/admin-orders.component';
import { AdminCategoriesComponent } from './features/admin/admin-categories/admin-categories.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
{ 
    path: 'adminpage',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'add-product', component: AdminProductsComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'categories', component: AdminCategoriesComponent },
    ]
  },
  // Customer routes
  { 
    path: 'customer', 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'customer' }, 
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent) },
      { path: 'cart', loadComponent: () => import('./features/shopping-cart/shopping-cart.component').then(m => m.ShoppingCartComponent) },
      { path: 'orders', loadComponent: () => import('./features/my-order/my-order.component').then(m => m.MyOrderComponent) },
      {path: 'checkout', loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent)},
      { path: 'order-success', loadComponent: () => import('./features/order-success/order-success').then(m => m.OrderSuccess) },
      { path: 'wishlist', loadComponent: () => import('./features/wishlist/wishlist.component').then(m => m.WishlistComponent) },
      { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'voucher', loadComponent: () => import('./features/voucher/voucher.component').then(m => m.VoucherComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  // Additional routes - these are redirects to the customer routes for compatibility
  { path: 'products', redirectTo: '/customer/dashboard', pathMatch: 'full' },
  { path: 'shopping-cart', redirectTo: '/customer/cart', pathMatch: 'full' },
  { path: 'my-orders', redirectTo: '/customer/orders', pathMatch: 'full' },// Add wishlist redirect
  { path: 'account', redirectTo: 'login', pathMatch: 'full' },
  
  // Wildcard route for 404
  { path: '**', redirectTo: '/home' }
];
