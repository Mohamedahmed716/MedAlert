import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HospitalService } from '../../../core/services/hospital.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './SignUp.component.html',
  styleUrls: ['./SignUp.component.css'],
})
export class SignUpComponent implements OnInit {
  user = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    role: '',
    hospital: '',
  };

  hospitals: any[] = [];
  passwordVisible1 = false;
  passwordVisible2 = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private hospitalService: HospitalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHospitals();
  }

  loadHospitals() {
    this.hospitalService.getHospitals().subscribe({
      next: (response: any) => {
        console.log('✅ API SUCCESS:', response);

        if (Array.isArray(response)) {
          this.hospitals = response;
        } else if (response && Array.isArray(response.data)) {
          this.hospitals = response.data;
        } else {
          this.hospitals = [];
          console.warn('⚠️ Data format issue:', response);
        }
      },
      error: (err: any) => {
        console.error('❌ API ERROR:', err);

        // DISPLAY THE EXACT ERROR CODE TO HELP DEBUGGING
        if (err.status === 0) {
          this.errorMessage =
            'Connection Error (Status: 0). Backend is down OR CORS is blocking access.';
        } else if (err.status === 404) {
          this.errorMessage = 'Error 404: The URL /api/v1/hospitals is wrong.';
        } else if (err.status === 403) {
          this.errorMessage = 'Error 403: You are not authorized to view hospitals.';
        } else {
          this.errorMessage = `Error ${err.status}: ${err.message}`;
        }
      },
    });
  }

  get showHospitalField(): boolean {
    return this.user.role === 'Doctor' || this.user.role === 'Hospital Admin';
  }

  togglePassword1() {
    this.passwordVisible1 = !this.passwordVisible1;
  }

  togglePassword2() {
    this.passwordVisible2 = !this.passwordVisible2;
  }

  onSignUp() {
    this.errorMessage = '';

    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;

    let backendRole = '';
    if (this.user.role === 'Super Admin') backendRole = 'SYSTEM_ADMIN';
    else backendRole = this.user.role.toUpperCase().replace(' ', '_');

    const payload = {
      fullName: this.user.fullName,
      email: this.user.email,
      password: this.user.password,
      role: backendRole,
      hospitalId: this.showHospitalField ? this.user.hospital : null,
      dateOfBirth: this.user.dateOfBirth,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/auth/SignIn']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed.';
      },
    });
  }
}
