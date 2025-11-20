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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['registered'] === 'true') {
        this.showNotification = true;

        setTimeout(() => {
          this.showNotification = false;
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { registered: null },
            queryParamsHandling: 'merge',
          });
        }, 6000);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.showNotification = false;

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

        const backendMessage = err.error?.message;

        if (err.status === 403 && backendMessage === 'ACCOUNT_PENDING') {
          this.errorMessage = 'Your account is pending for approval.';
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else {
          this.errorMessage = 'Login failed. Please check your credentials or try again later.';
        }
        console.error('Login error:', err);
      },
    });
  }
}
