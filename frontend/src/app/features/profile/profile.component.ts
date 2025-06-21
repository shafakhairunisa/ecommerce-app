import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { CustomerHeaderComponent } from '../../shared/components/customer-header/customer-header.component';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CustomerHeaderComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  showCurrentPassword = false;
  showNewPassword = false;
  userRole: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [{ value: '', disabled: true }],
      gender: [''],
      bio: [''],
      address: [''],
      phoneNumber: [''],
      dateOfBirth: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
      ]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.userRole = this.authService.getUserRole();
  }
  
  loadUserProfile(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.profileForm.patchValue({
          username: user.username,
          email: user.email,
          role: user.role,
          gender: user.gender,
          bio: user.bio,
          address: user.address,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
        });
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load profile data';
        console.error('Profile load error:', error);
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const profileData = this.profileForm.getRawValue();
    this.authService.updateProfile(profileData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update profile.';
        this.loading = false;
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { currentPassword, newPassword } = this.passwordForm.value;
    this.authService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully!';
        this.passwordForm.reset();
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to change password.';
        this.loading = false;
      }
    });
  }

  toggleShowCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleShowNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }
}