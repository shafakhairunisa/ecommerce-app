import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <a routerLink="/" class="brand-link">E-Commerce</a>
      </div>

      <div class="navbar-menu">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
        <a routerLink="/products" routerLinkActive="active">Products</a>
        <a routerLink="/cart" routerLinkActive="active">Cart</a>
        
        <ng-container *ngIf="user">
          <a routerLink="/profile" routerLinkActive="active">Profile</a>
          <a routerLink="/orders" routerLinkActive="active">Orders</a>
          
          <ng-container *ngIf="user.role === 'admin'">
            <a routerLink="/admin/products" routerLinkActive="active">Manage Products</a>
            <a routerLink="/admin/orders" routerLinkActive="active">Manage Orders</a>
            <a routerLink="/admin/users" routerLinkActive="active">Manage Users</a>
          </ng-container>
        </ng-container>
      </div>

      <div class="navbar-end">
        <ng-container *ngIf="user; else authButtons">
          <span class="user-email">{{ user.email }}</span>
          <button class="logout-button" (click)="onLogout()">Logout</button>
        </ng-container>
        <ng-template #authButtons>
          <a routerLink="/login" class="auth-button">Login</a>
          <a routerLink="/register" class="auth-button">Register</a>
        </ng-template>
      </div>
    </nav>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .navbar-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .brand-link {
      color: #333;
      text-decoration: none;
    }

    .navbar-menu {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .navbar-menu a {
      color: #666;
      text-decoration: none;
      padding: 0.5rem;
      transition: color 0.2s;
    }

    .navbar-menu a:hover {
      color: #007bff;
    }

    .navbar-menu a.active {
      color: #007bff;
      font-weight: 500;
    }

    .navbar-end {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-email {
      color: #666;
      font-size: 0.9rem;
    }

    .auth-button {
      color: #007bff;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border: 1px solid #007bff;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .auth-button:hover {
      background-color: #007bff;
      color: white;
    }

    .logout-button {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .logout-button:hover {
      background-color: #c82333;
    }

    .main-content {
      min-height: calc(100vh - 64px);
    }
  `]
})
export class NavigationComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 