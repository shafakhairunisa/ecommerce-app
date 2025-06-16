/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { authGuard } from './app/guards/auth.guard';
import { authInterceptor } from './app/interceptors/auth.interceptor';

const routes: Routes = [
  { path: 'login', loadComponent: () => import('./app/components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./app/components/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'products', loadComponent: () => import('./app/components/product-list/product-list.component').then(m => m.ProductListComponent) },
  { path: 'cart', loadComponent: () => import('./app/components/cart/cart.component').then(m => m.CartComponent) },
  { path: 'orders', loadComponent: () => import('./app/components/order-history/order-history.component').then(m => m.OrderHistoryComponent) },
  { 
    path: 'profile', 
    loadComponent: () => import('./app/components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  { path: '', loadComponent: () => import('./app/components/home/home.component').then(m => m.HomeComponent) }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
}).catch(err => console.error(err));
