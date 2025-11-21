import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-manage-hospital',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-hospital.component.html',
  styleUrls: ['./add-hospital.component.css'],
})
export class ManageHospitalComponent {
  hospital = {
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

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/SignIn']);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSaveHospital() {
    console.log('Saving Hospital:', this.hospital);
    console.log('Creating Admin:', this.admin);
    // TODO: Call backend API to save data

    // --- MODIFIED: Redirect to Dashboard with success flag ---
    this.router.navigate(['/admin/dashboard'], { queryParams: { created: 'true' } });
  }

  onCancel() {
    this.router.navigate(['/admin/dashboard']);
  }
}
