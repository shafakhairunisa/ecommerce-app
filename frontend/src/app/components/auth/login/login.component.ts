import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-bg">
      <div class="login-card">
        <h2 class="login-title">Sign in to your account</h2>
        <p class="login-subtitle">
          Or <a routerLink="/register" class="login-link">create a new account</a>
        </p>
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="login-form">
          <div class="input-group">
            <span class="input-icon"><i class="bi bi-person"></i></span>
            <input
              id="username"
              name="username"
              type="text"
              [(ngModel)]="username"
              required
              class="login-input"
              placeholder="Username"
              [disabled]="isLoading"
            >
          </div>
          <div class="input-group">
            <span class="input-icon"><i class="bi bi-lock"></i></span>
            <input
              id="password"
              name="password"
              type="password"
              [(ngModel)]="password"
              required
              class="login-input"
              placeholder="Password"
              [disabled]="isLoading"
            >
          </div>
          <div class="login-row">
            <label class="remember-me">
              <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" [disabled]="isLoading"> Remember me
            </label>
            <a href="#" class="forgot-link">Forgot your password?</a>
          </div>
          <button type="submit" class="login-btn" [disabled]="!loginForm.form.valid || isLoading">
            <span *ngIf="isLoading"><i class="bi bi-arrow-repeat spin"></i> Signing in...</span>
            <span *ngIf="!isLoading">Sign in</span>
          </button>
          <div *ngIf="error" class="login-error">{{ error }}</div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-bg {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f7f8fa;
    }
    .login-card {
      background: #fff;
      padding: 2.5rem 2rem 2rem 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      width: 100%;
      max-width: 380px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .login-title {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: #222;
      text-align: center;
    }
    .login-subtitle {
      font-size: 1rem;
      color: #666;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .login-link {
      color: #007bff;
      text-decoration: none;
    }
    .login-link:hover {
      text-decoration: underline;
    }
    .login-form {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .input-group {
      display: flex;
      align-items: center;
      background: #f1f3f6;
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
      border: 1px solid #e0e0e0;
    }
    .input-icon {
      color: #888;
      margin-right: 0.5rem;
      font-size: 1.2rem;
    }
    .login-input {
      border: none;
      background: transparent;
      outline: none;
      width: 100%;
      font-size: 1rem;
      padding: 0.5rem 0;
    }
    .login-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.95rem;
      margin-bottom: 0.5rem;
    }
    .remember-me {
      color: #555;
      user-select: none;
    }
    .forgot-link {
      color: #007bff;
      text-decoration: none;
      font-size: 0.95rem;
    }
    .forgot-link:hover {
      text-decoration: underline;
    }
    .login-btn {
      width: 100%;
      padding: 0.75rem;
      background: #007bff;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 0.5rem;
    }
    .login-btn:disabled {
      background: #b3d1fa;
      cursor: not-allowed;
    }
    .login-error {
      color: #dc3545;
      background: #fff0f0;
      border: 1px solid #f5c2c7;
      border-radius: 4px;
      padding: 0.5rem 1rem;
      margin-top: 1rem;
      text-align: center;
      font-size: 1rem;
    }
    .spin {
      display: inline-block;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
    @media (max-width: 500px) {
      .login-card {
        padding: 1.5rem 0.5rem 1.5rem 0.5rem;
      }
      .login-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.username && this.password) {
      this.isLoading = true;
      this.error = '';

      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.admin) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (err) => {
          this.error = err.message || 'Invalid username or password';
          this.isLoading = false;
        }
      });
    }
  }
} 