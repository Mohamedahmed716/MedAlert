import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { HospitalService } from '../../../core/services/hospital.service';

@Component({
  selector: 'app-manage-hospital',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-hospital.component.html',
  styleUrls: ['./add-hospital.component.css'],
})
export class ManageHospitalComponent implements OnInit {
  hospital = {
    id: null,
    name: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    website: '',
  };

  admin = { username: '', password: '' };

  passwordVisible = false;
  isEditMode = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private hospitalService: HospitalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const hospitalId = this.route.snapshot.paramMap.get('id');
    if (hospitalId) {
      this.isEditMode = true;
      this.loadHospitalData(hospitalId);
    }
  }

  loadHospitalData(id: string) {
    this.hospitalService.getHospitalById(id).subscribe({
      next: (data: any) => {
        this.hospital = {
          id: data.id,
          name: data.name,
          streetAddress: data.streetAddress,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          phoneNumber: data.phoneNumber,
          website: data.website,
        };
        if (data.adminEmail) {
          this.admin.username = data.adminEmail;
        }
      },
      error: (err) => {
        this.errorMessage = 'Failed to load hospital details.';
      },
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSaveHospital() {
    this.errorMessage = '';

    if (this.isEditMode) {
      // UPDATE
      this.hospitalService.updateHospital(this.hospital.id!, this.hospital).subscribe({
        next: () =>
          this.router.navigate(['/admin/dashboard'], { queryParams: { created: 'true' } }),
        error: (err) => this.handleError(err),
      });
    } else {
      // CREATE
      const payload = {
        ...this.hospital,
        adminEmail: this.admin.username,
        adminPassword: this.admin.password,
      };

      this.hospitalService.createHospital(payload).subscribe({
        next: () =>
          this.router.navigate(['/admin/dashboard'], { queryParams: { created: 'true' } }),
        error: (err) => this.handleError(err),
      });
    }
  }

  handleError(err: any) {
    if (err.error && err.error.message) {
      this.errorMessage = err.error.message;
    } else if (err.status === 401) {
      this.errorMessage = 'Session expired. Please log in again.';
    } else {
      this.errorMessage = 'Operation failed. Please try again.';
    }
  }

  onCancel() {
    this.router.navigate(['/admin/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/sign-in']);
  }
}
