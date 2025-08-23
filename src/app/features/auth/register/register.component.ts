
import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, switchMap } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { CustomValidators } from '../../../shared/validators/custom.validators';
import { UserRole, getRoleDisplayName, getRoleDescription } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  errorMessage = '';
  
  userRoles = Object.values(UserRole);
  getRoleDisplayName = getRoleDisplayName;
  getRoleDescription = getRoleDescription;

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, CustomValidators.username]],
      email: ['', [Validators.required, CustomValidators.email]],
      password: ['', [Validators.required, CustomValidators.strongPassword]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      dateOfBirth: [''],
      phoneNumber: ['', [CustomValidators.phoneNumber]],
      role: ['', [Validators.required]],
      bio: ['', [Validators.maxLength(200)]],
      location: ['', [Validators.maxLength(100)]]
    }, { 
      validators: CustomValidators.passwordMatch 
    });

    // Setup async validators for username and email
    this.setupAsyncValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = { ...this.registerForm.value };
      
      // Format date if provided
      if (formData.dateOfBirth) {
        const date = new Date(formData.dateOfBirth);
        formData.dateOfBirth = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      }

      this.authService.register(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            // Automatically login after successful registration
            this.autoLogin(formData);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['username']) {
        const usernameErrors = field.errors['username'];
        if (usernameErrors.minLength) {
          return 'Username must be at least 3 characters long';
        }
        if (usernameErrors.maxLength) {
          return 'Username must not exceed 50 characters';
        }
        if (usernameErrors.invalidChars) {
          return 'Username can only contain letters, numbers, and underscores';
        }
      }
      if (field.errors['strongPassword']) {
        const passwordErrors = field.errors['strongPassword'];
        const messages = [];
        if (passwordErrors.minLength) messages.push('at least 8 characters');
        if (passwordErrors.lowercase) messages.push('one lowercase letter');
        if (passwordErrors.uppercase) messages.push('one uppercase letter');
        if (passwordErrors.number) messages.push('one number');
        if (passwordErrors.specialChar) messages.push('one special character');
        return `Password must contain ${messages.join(', ')}`;
      }
      if (field.errors['phoneNumber']) {
        return 'Please enter a valid phone number';
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} is too long`;
      }
    }

    // Check form-level errors
    if (fieldName === 'confirmPassword' && this.registerForm.errors?.['passwordMatch']) {
      return 'Passwords do not match';
    }

    return '';
  }

  private autoLogin(formData: any): void {
    this.authService.login({
      usernameOrEmail: formData.username,
      password: formData.password
    }).pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        // If auto-login fails, redirect to login page
        this.router.navigate(['/auth/login']);
      }
    });
  }

  private setupAsyncValidation(): void {
    // Username availability check
    this.registerForm.get('username')?.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(username => {
          if (username && username.length >= 3) {
            return this.authService.checkUsernameAvailability(username);
          }
          return [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(available => {
        const usernameControl = this.registerForm.get('username');
        if (usernameControl && !available) {
          usernameControl.setErrors({ ...usernameControl.errors, unavailable: true });
        }
      });

    // Email availability check
    this.registerForm.get('email')?.valueChanges
      .pipe(
        debounceTime(500),
        switchMap(email => {
          if (email && email.includes('@')) {
            return this.authService.checkEmailAvailability(email);
          }
          return [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(available => {
        const emailControl = this.registerForm.get('email');
        if (emailControl && !available) {
          emailControl.setErrors({ ...emailControl.errors, unavailable: true });
        }
      });
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      dateOfBirth: 'Date of Birth',
      phoneNumber: 'Phone Number',
      role: 'Role',
      bio: 'Bio',
      location: 'Location'
    };
    return displayNames[fieldName] || fieldName;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }
}
