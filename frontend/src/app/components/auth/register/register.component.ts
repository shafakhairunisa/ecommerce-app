import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Or
            <a routerLink="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </a>
          </p>
        </div>
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="name" class="sr-only">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                [(ngModel)]="name"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full name"
              >
            </div>
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                [(ngModel)]="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              >
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                [(ngModel)]="password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              >
            </div>
            <div>
              <label for="confirmPassword" class="sr-only">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                [(ngModel)]="confirmPassword"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm password"
              >
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="!registerForm.form.valid || isLoading || password !== confirmPassword"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              {{ isLoading ? 'Creating account...' : 'Create account' }}
            </button>
          </div>
        </form>

        <!-- Error Message -->
        <div *ngIf="error" class="mt-4 text-center text-sm text-red-600">
          {{ error }}
        </div>

        <!-- Password Mismatch Warning -->
        <div *ngIf="password && confirmPassword && password !== confirmPassword" class="mt-4 text-center text-sm text-red-600">
          Passwords do not match
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (this.name && this.email && this.password && this.password === this.confirmPassword) {
      this.isLoading = true;
      this.error = '';

      this.authService.register(this.name, this.email, this.password).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.message || 'An error occurred during registration';
          this.isLoading = false;
        }
      });
    }
  }
} 