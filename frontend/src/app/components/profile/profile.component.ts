import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <div class="bg-white shadow sm:rounded-lg">
          <!-- Profile Information -->
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
            <div class="mt-5">
              <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
                <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div class="sm:col-span-3">
                    <label for="name" class="block text-sm font-medium text-gray-700">Full name</label>
                    <div class="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        [(ngModel)]="name"
                        required
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                    </div>
                  </div>

                  <div class="sm:col-span-3">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <div class="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        [(ngModel)]="email"
                        required
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                    </div>
                  </div>
                </div>
                <div class="mt-6">
                  <button
                    type="submit"
                    [disabled]="!profileForm.form.valid || isLoading"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {{ isLoading ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Change Password -->
          <div class="px-4 py-5 sm:p-6 border-t border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Change Password</h3>
            <div class="mt-5">
              <form (ngSubmit)="changePassword()" #passwordForm="ngForm">
                <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div class="sm:col-span-3">
                    <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current password</label>
                    <div class="mt-1">
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        [(ngModel)]="currentPassword"
                        required
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                    </div>
                  </div>

                  <div class="sm:col-span-3">
                    <label for="newPassword" class="block text-sm font-medium text-gray-700">New password</label>
                    <div class="mt-1">
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        [(ngModel)]="newPassword"
                        required
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                    </div>
                  </div>

                  <div class="sm:col-span-3">
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm new password</label>
                    <div class="mt-1">
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        [(ngModel)]="confirmPassword"
                        required
                        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                    </div>
                  </div>
                </div>
                <div class="mt-6">
                  <button
                    type="submit"
                    [disabled]="!passwordForm.form.valid || isLoading || newPassword !== confirmPassword"
                    class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {{ isLoading ? 'Changing password...' : 'Change Password' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Error Messages -->
          <div *ngIf="error" class="px-4 py-3 bg-red-50 sm:px-6">
            <div class="text-sm text-red-700">
              {{ error }}
            </div>
          </div>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="px-4 py-3 bg-green-50 sm:px-6">
            <div class="text-sm text-green-700">
              {{ successMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  name: string = '';
  email: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  error: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Load user profile data
    this.authService.getCurrentUser().subscribe(
      user => {
        if (user) {
          this.name = user.name;
          this.email = user.email;
        }
      },
      error => {
        this.error = 'Error loading profile data';
        console.error('Error loading profile:', error);
      }
    );
  }

  updateProfile() {
    if (this.name && this.email) {
      this.isLoading = true;
      this.error = '';
      this.successMessage = '';

      this.authService.updateProfile(this.name, this.email).subscribe({
        next: () => {
          this.successMessage = 'Profile updated successfully';
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message || 'Error updating profile';
          this.isLoading = false;
        }
      });
    }
  }

  changePassword() {
    if (this.currentPassword && this.newPassword && this.newPassword === this.confirmPassword) {
      this.isLoading = true;
      this.error = '';
      this.successMessage = '';

      this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
        next: () => {
          this.successMessage = 'Password changed successfully';
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.isLoading = false;
        },
        error: (err) => {
          this.error = err.message || 'Error changing password';
          this.isLoading = false;
        }
      });
    }
  }
} 