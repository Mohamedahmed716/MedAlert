import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../features/auth/auth.service';
import { UserService } from '../../../core/services/user.service';
import { HospitalService } from '../../../core/services/hospital.service';

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
  };

  hospitals: any[] = [];
  passwordVisible1 = false;
  passwordVisible2 = false;
  errorMessage = '';
  isEditMode = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private hospitalService: HospitalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadHospitals();

    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.isEditMode = true;
      this.loadUserData(userId);
    }
  }

  loadHospitals() {
    this.hospitalService.getHospitals().subscribe({
      next: (data: any) => {
        this.hospitals = data;
      },
      error: (err: any) => {
        console.error('Error loading hospitals:', err);
        this.errorMessage = 'Failed to load hospital list.';
      },
    });
  }

  loadUserData(id: string) {
    this.userService.getUserById(id).subscribe({
      next: (data: any) => {
        this.user.id = data.id;
        this.user.fullName = data.fullName;
        this.user.email = data.email;
        this.user.hospital = data.hospitalId;
        this.user.role = this.formatRoleForSelect(data.role);
      },
      error: (err: any) => {
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
      // If the field is visible, send the ID. If not, send null.
      hospitalId: this.showHospitalField ? this.user.hospital : null,
    };

    if (this.isEditMode && this.user.id) {
      this.userService.updateUser(this.user.id, payload).subscribe({
        next: () => this.router.navigate(['/admin/users'], { queryParams: { created: 'true' } }),
        error: (err: any) => (this.errorMessage = err.error?.message || 'Failed to update user.'),
      });
    } else {
      this.userService.createUser(payload).subscribe({
        next: () => this.router.navigate(['/admin/users'], { queryParams: { created: 'true' } }),
        error: (err: any) => (this.errorMessage = err.error?.message || 'Failed to create user.'),
      });
    }
  }

  onCancel() {
    this.router.navigate(['/admin/users']);
  }
}
