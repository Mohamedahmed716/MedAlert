import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../features/auth/auth.service';
import { UserService } from '../../../core/services/user.service';
import { HospitalService } from '../../../core/services/hospital.service';
import { User } from '../../../shared/ui/models/auth.models';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  user = {
    id: null,
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    hospital: '',
    gender: 'Male',
  };

  // Dropdown Data
  genders = ['Male', 'Female'];
  roles = ['Patient', 'Doctor', 'Hospital Admin', 'Super Admin'];
  hospitals: any[] = [];

  // Dropdown States
  isGenderOpen = false;
  isRoleOpen = false;
  isHospitalOpen = false;

  passwordVisible1 = false;
  passwordVisible2 = false;
  errorMessage = '';
  isEditMode = false;

  // Header Profile Photo
  profilePhotoUrl: string = 'assets/default.png';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private hospitalService: HospitalService,
    private router: Router,
    private route: ActivatedRoute,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadHospitals();

    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.isEditMode = true;
      this.loadUserData(userId);
    }
  }

  // --- CUSTOM DROPDOWN LOGIC ---

  toggleGender() {
    this.isGenderOpen = !this.isGenderOpen;
    this.isRoleOpen = false;
    this.isHospitalOpen = false;
  }

  selectGender(gender: string) {
    this.user.gender = gender;
    this.isGenderOpen = false;
  }

  toggleRole() {
    this.isRoleOpen = !this.isRoleOpen;
    this.isGenderOpen = false;
    this.isHospitalOpen = false;
  }

  selectRole(role: string) {
    this.user.role = role;
    this.isRoleOpen = false;

    // Clear hospital if role doesn't need it
    if (!this.showHospitalField) {
      this.user.hospital = '';
    }
  }

  toggleHospital() {
    this.isHospitalOpen = !this.isHospitalOpen;
    this.isGenderOpen = false;
    this.isRoleOpen = false;
  }

  selectHospital(hospitalId: string) {
    this.user.hospital = hospitalId;
    this.isHospitalOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isGenderOpen = false;
      this.isRoleOpen = false;
      this.isHospitalOpen = false;
    }
  }

  // --- EXISTING LOGIC ---

  loadCurrentUser() {
    this.userService.getCurrentUserProfile().subscribe({
      next: (user) => {
        if (user.profilePhotoUrl) {
          this.profilePhotoUrl = user.profilePhotoUrl;
        } else {
          const gender = user.gender ? user.gender.toLowerCase() : '';
          if (gender === 'male') this.profilePhotoUrl = 'assets/male.png';
          else if (gender === 'female') this.profilePhotoUrl = 'assets/female.png';
          else this.profilePhotoUrl = 'assets/default.png';
        }
      },
      error: (err) => {
        this.profilePhotoUrl = 'assets/default.png';
      },
    });
  }

  loadHospitals() {
    this.hospitalService.getHospitals().subscribe({
      next: (data: any) => (this.hospitals = data),
      error: (err) => console.error('Error loading hospitals:', err),
    });
  }

  loadUserData(id: string) {
    this.userService.getUserById(id).subscribe({
      next: (data: User) => {
        this.user.id = data.id as any;
        this.user.fullName = data.fullName;
        this.user.email = data.email;
        this.user.hospital = data.hospitalId || '';
        this.user.role = this.formatRoleForSelect(data.role);
        this.user.gender = data.gender || 'Male';
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user data.';
      },
    });
  }

  formatRoleForSelect(backendRole: string): string {
    if (!backendRole) return '';
    if (backendRole === 'HOSPITAL_ADMIN') return 'Hospital Admin';
    if (backendRole === 'SUPER_ADMIN' || backendRole === 'SYSTEM_ADMIN') return 'Super Admin';
    if (backendRole === 'DOCTOR') return 'Doctor';
    if (backendRole === 'PATIENT') return 'Patient';
    return backendRole;
  }

  get showHospitalField(): boolean {
    return this.user.role === 'Doctor' || this.user.role === 'Hospital Admin';
  }

  // Helper to display hospital name
  get selectedHospitalName(): string {
    const found = this.hospitals.find((h) => h.id == this.user.hospital);
    return found ? found.name : '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/SignIn']);
  }

  togglePassword1() {
    this.passwordVisible1 = !this.passwordVisible1;
  }

  togglePassword2() {
    this.passwordVisible2 = !this.passwordVisible2;
  }

  onSaveUser() {
    this.errorMessage = '';

    if (this.user.password && this.user.password !== this.user.confirmPassword) {
      return;
    }

    let backendRole = '';
    if (this.user.role === 'Super Admin') backendRole = 'SYSTEM_ADMIN';
    else backendRole = this.user.role.toUpperCase().replace(' ', '_');

    const payload = {
      fullName: this.user.fullName,
      email: this.user.email,
      password: this.user.password,
      role: backendRole,
      hospitalId: this.showHospitalField ? this.user.hospital : null,
      gender: this.user.gender,
    };

    if (this.isEditMode && this.user.id) {
      this.userService.updateUser(this.user.id, payload).subscribe({
        next: () => this.router.navigate(['/admin/users'], { queryParams: { created: 'true' } }),
        error: (err) => (this.errorMessage = err.error?.message || 'Failed to update user.'),
      });
    } else {
      this.userService.createUser(payload).subscribe({
        next: () => this.router.navigate(['/admin/users'], { queryParams: { created: 'true' } }),
        error: (err) => (this.errorMessage = err.error?.message || 'Failed to create user.'),
      });
    }
  }

  onCancel() {
    this.router.navigate(['/admin/users']);
  }
}
