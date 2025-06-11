import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <h2>Profile</h2>
        
        <div class="profile-info" *ngIf="user">
          <div class="info-group">
            <label>Email:</label>
            <span>{{ user.email }}</span>
          </div>
          <div class="info-group">
            <label>Role:</label>
            <span>{{ user.role }}</span>
          </div>
        </div>

        <div class="change-password-section">
          <h3>Change Password</h3>
          <form [formGroup]="passwordForm" (ngSubmit)="onPasswordChange()">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                formControlName="currentPassword"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('currentPassword')"
              />
              <div class="invalid-feedback" *ngIf="isFieldInvalid('currentPassword')">
                Current password is required
              </div>
            </div>

            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                formControlName="newPassword"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('newPassword')"
              />
              <div class="invalid-feedback" *ngIf="isFieldInvalid('newPassword')">
                New password must be at least 6 characters long
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                formControlName="confirmPassword"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('confirmPassword')"
              />
              <div class="invalid-feedback" *ngIf="isFieldInvalid('confirmPassword')">
                Passwords do not match
              </div>
            </div>

            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <div class="success-message" *ngIf="successMessage">
              {{ successMessage }}
            </div>

            <button type="submit" [disabled]="passwordForm.invalid || isLoading">
              {{ isLoading ? 'Changing Password...' : 'Change Password' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 2rem;
      background-color: #f5f5f5;
    }

    .profile-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 600px;
    }

    .profile-info {
      margin-bottom: 2rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .info-group {
      margin-bottom: 1rem;
    }

    .info-group label {
      font-weight: bold;
      margin-right: 0.5rem;
    }

    .change-password-section {
      border-top: 1px solid #dee2e6;
      padding-top: 2rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .error-message {
      color: #dc3545;
      margin-bottom: 1rem;
      text-align: center;
    }

    .success-message {
      color: #28a745;
      margin-bottom: 1rem;
      text-align: center;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  passwordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    }
    
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.passwordForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onPasswordChange(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { currentPassword, newPassword } = this.passwordForm.value;

      this.http.post(`${environment.apiUrl}/auth/change-password`, {
        currentPassword,
        newPassword
      }).subscribe({
        next: () => {
          this.successMessage = 'Password changed successfully';
          this.passwordForm.reset();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'An error occurred while changing password';
          this.isLoading = false;
        }
      });
    }
  }
} 