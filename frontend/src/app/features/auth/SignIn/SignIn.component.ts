import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService, LoginRequest } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './SignIn.component.html',
  styleUrls: ['./SignIn.component.css'],
})
export class SignInComponent implements OnInit {
  email = '';
  password = '';
  passwordVisible = false;
  isLoading = false;
  errorMessage = '';

  showNotification = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute // Used to check if we just registered
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['registered'] === 'true') {
        this.showNotification = true;

        setTimeout(() => {
          this.showNotification = false;
        }, 4000);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.authService.saveToken(response.token);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        // Check for 403 Forbidden (which usually means Account Disabled/Pending)
        if (err.status === 403 || err.error?.message?.toLowerCase().includes('disabled')) {
          this.errorMessage = 'Your account is pending approval.';
        } else {
          this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
        }
        console.error('Login error:', err);
      },
    });
  }
}
