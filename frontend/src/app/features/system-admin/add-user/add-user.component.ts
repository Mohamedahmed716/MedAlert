import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent {
  user = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    hospital: '',
  };

  passwordVisible1 = false;
  passwordVisible2 = false;

  constructor(private authService: AuthService, private router: Router) {}

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
    if (this.user.password !== this.user.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Creating User:', this.user);
    // TODO: Call backend API to create user

    this.router.navigate(['/admin/users'], { queryParams: { created: 'true' } });
  }

  onCancel() {
    this.router.navigate(['/admin/users']);
  }
}
