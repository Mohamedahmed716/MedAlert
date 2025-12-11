import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HospitalService } from '../../../core/services/hospital.service';
import { HttpClientModule } from '@angular/common/http';
// Import the correct interface to ensure type safety
import { RegisterRequest } from '../../../shared/ui/models/auth.models';

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
    gender: 'Male', // FIX: Added default gender
  };

  selectedHospitalName: string = '';
  hospitals: any[] = [];
  passwordVisible1 = false;
  passwordVisible2 = false;
  errorMessage = '';
  isLoading = false;

  // Dropdown States
  isRoleOpen = false;
  isHospitalOpen = false;
  isGenderOpen = false; // New state for gender dropdown

  roles = ['Patient', 'Doctor', 'Hospital Admin'];
  genders = ['Male', 'Female']; // Options for gender

  // Calendar State
  isDateOpen = false;
  currentYear: number;
  currentMonth: number;
  calendarDays: (number | null)[] = [];
  monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  yearRange: number[] = [];
  today = new Date();

  constructor(
    private authService: AuthService,
    private hospitalService: HospitalService,
    private router: Router,
    private eRef: ElementRef
  ) {
    this.currentYear = this.today.getFullYear();
    this.currentMonth = this.today.getMonth();

    for (let y = this.currentYear; y >= 1900; y--) {
      this.yearRange.push(y);
    }
  }

  ngOnInit(): void {
    this.loadHospitals();
    this.generateCalendar();
  }

  // --- DROPDOWN LOGIC ---
  toggleRole() {
    this.isRoleOpen = !this.isRoleOpen;
    this.isHospitalOpen = false;
    this.isDateOpen = false;
    this.isGenderOpen = false;
  }

  selectRole(role: string) {
    this.user.role = role;
    this.isRoleOpen = false;
    if (!this.showHospitalField) {
      this.user.hospital = '';
      this.selectedHospitalName = '';
    }
  }

  toggleHospital() {
    this.isHospitalOpen = !this.isHospitalOpen;
    this.isRoleOpen = false;
    this.isDateOpen = false;
    this.isGenderOpen = false;
  }

  selectHospital(hospital: any) {
    this.user.hospital = hospital.id;
    this.selectedHospitalName = hospital.name || hospital.hospitalName || hospital.title;
    this.isHospitalOpen = false;
  }

  // New Gender Logic
  toggleGender() {
    this.isGenderOpen = !this.isGenderOpen;
    this.isRoleOpen = false;
    this.isHospitalOpen = false;
    this.isDateOpen = false;
  }

  selectGender(gender: string) {
    this.user.gender = gender;
    this.isGenderOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isRoleOpen = false;
      this.isHospitalOpen = false;
      this.isDateOpen = false;
      this.isGenderOpen = false;
    }
  }

  // --- CALENDAR LOGIC (Standard) ---
  toggleDate() {
    this.isDateOpen = !this.isDateOpen;
    this.isRoleOpen = false;
    this.isHospitalOpen = false;
    this.isGenderOpen = false;
    if (this.isDateOpen && this.user.dateOfBirth) {
      const parts = this.user.dateOfBirth.split('-');
      this.currentYear = parseInt(parts[0]);
      this.currentMonth = parseInt(parts[1]) - 1;
      this.generateCalendar();
    }
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (
      this.currentYear === this.today.getFullYear() &&
      this.currentMonth === this.today.getMonth()
    )
      return;
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.generateCalendar();
  }

  jumpToYear(year: string) {
    this.currentYear = parseInt(year);
    if (
      this.currentYear === this.today.getFullYear() &&
      this.currentMonth > this.today.getMonth()
    ) {
      this.currentMonth = this.today.getMonth();
    }
    this.generateCalendar();
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    this.calendarDays = [];
    for (let i = 0; i < startingDay; i++) {
      this.calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push(i);
    }
  }

  selectDate(day: number | null) {
    if (!day) return;
    const monthStr = (this.currentMonth + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    this.user.dateOfBirth = `${this.currentYear}-${monthStr}-${dayStr}`;
    this.isDateOpen = false;
  }

  isFutureDate(day: number | null): boolean {
    if (!day) return true;
    const checkDate = new Date(this.currentYear, this.currentMonth, day);
    return checkDate > this.today;
  }

  loadHospitals() {
    this.hospitalService.getHospitals().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.hospitals = response;
        } else if (response && Array.isArray(response.data)) {
          this.hospitals = response.data;
        } else {
          this.hospitals = [];
        }
      },
      error: (err: any) => {
        if (err.status === 0) {
          this.errorMessage = 'Connection Error: Backend not reachable.';
        } else {
          this.errorMessage = 'Could not load hospitals.';
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

    const payload: RegisterRequest = {
      fullName: this.user.fullName,
      email: this.user.email,
      password: this.user.password,
      role: backendRole,
      hospitalId: this.showHospitalField ? this.user.hospital : null,
      dateOfBirth: this.user.dateOfBirth,
      gender: this.user.gender as 'Male' | 'Female',
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/auth/SignIn'], { queryParams: { registered: 'true' } });
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed.';
      },
    });
  }
}
