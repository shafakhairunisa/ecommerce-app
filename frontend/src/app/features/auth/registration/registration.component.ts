import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  loading = false;
  registerSubmitted = false;
  error = '';
  hidePassword = true;

  // Password requirement indicators
  hasMinLength = false;
  hasUppercase = false;
  hasLowercase = false;
  hasNumber = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registrationForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
      ]],
      role: ['customer']
    });
  }

  ngOnInit() {
    // Only clear auth state, don't navigate
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');

    // Subscribe to password changes to update requirements
    this.registrationForm.get('password')?.valueChanges.subscribe(password => {
      this.updatePasswordRequirements(password || '');
    });
  }

  private updatePasswordRequirements(password: string): void {
    this.hasMinLength = password.length >= 6;
    this.hasUppercase = /[A-Z]/.test(password);
    this.hasLowercase = /[a-z]/.test(password);
    this.hasNumber = /\d/.test(password);
  }

  get f() { return this.registrationForm.controls; }

  async goToLogin() {
    console.log('Attempting to navigate to login...');
    try {
      // Don't call logout() here since we just want to navigate
      await this.router.navigate(['/login'], { replaceUrl: true });
      console.log('Navigation completed');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onRegister() {
    this.registerSubmitted = true;
    this.error = '';

    if (this.registrationForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.register(this.registrationForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: (error) => {
        console.error('Registration error:', error);
        if (typeof error === 'string') {
          this.error = error;
        } else if (error.status === 0) {
          this.error = 'Cannot connect to server. Please check if the backend is running.';
        } else if (error.status === 400) {
          this.error = 'Invalid registration data. Please check your inputs.';
        } else if (error.status === 409) {
          this.error = 'Username or email already exists.';
        } else if (error.status === 500) {
          this.error = 'Server error. Please try again later.';
        } else {
          this.error = error.message || 'An unknown error occurred';
        }
        this.loading = false;
      }
    });
  }
} 