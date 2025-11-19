import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { RegisterRequest } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './SignUp.component.html',
  styleUrls: ['./SignUp.component.css'],
})
export class SignUpComponent {
  fullName = '';
  email = '';
  password = '';
  dateOfBirth = '';
  role = '';
  hospital = '';

  passwordVisible = false;
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  get showHospitalField(): boolean {
    return this.role === 'doctor' || this.role === 'admin';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSignUp(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const registerPayload: RegisterRequest = {
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      dateOfBirth: this.dateOfBirth,
      role: this.role.toUpperCase(),
      hospitalId: this.showHospitalField ? this.hospital : null,
    };

    this.authService.register(registerPayload).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration successful', response);
        this.router.navigate(['/auth/sign-in']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
        console.error('Registration error:', err);
      },
    });
  }
}
