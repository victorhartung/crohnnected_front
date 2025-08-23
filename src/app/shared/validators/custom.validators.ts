
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export class CustomValidators {
  
  /**
   * Email validator with improved pattern matching
   */
  static email(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailPattern.test(control.value)) {
      return { email: { actualValue: control.value } };
    }
    
    return null;
  }

  /**
   * Strong password validator
   */
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const password = control.value;
    const errors: any = {};

    if (password.length < 8) {
      errors.minLength = true;
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.lowercase = true;
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.uppercase = true;
    }

    if (!/(?=.*[0-9])/.test(password)) {
      errors.number = true;
    }

    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      errors.specialChar = true;
    }

    return Object.keys(errors).length > 0 ? { strongPassword: errors } : null;
  }

  /**
   * Password confirmation validator
   */
  static passwordMatch: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return { passwordMatch: true };
    }

    return null;
  };

  /**
   * Username validator
   */
  static username(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const username = control.value;
    const errors: any = {};

    if (username.length < 3) {
      errors.minLength = true;
    }

    if (username.length > 50) {
      errors.maxLength = true;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.invalidChars = true;
    }

    return Object.keys(errors).length > 0 ? { username: errors } : null;
  }

  /**
   * Phone number validator (basic)
   */
  static phoneNumber(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const phonePattern = /^[+]?[\d\s\-()]+$/;
    
    if (!phonePattern.test(control.value)) {
      return { phoneNumber: { actualValue: control.value } };
    }

    return null;
  }
}
