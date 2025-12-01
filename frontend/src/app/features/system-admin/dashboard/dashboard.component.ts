import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-system-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class SystemAdminDashboardComponent implements OnInit {
  // Mock Data
  hospitals = [
    { name: 'City General Hospital', location: 'New York, NY', status: 'Active' },
    { name: 'Oak Valley Healthcare', location: 'San Francisco, CA', status: 'Active' },
    { name: 'Sunset Medical Center', location: 'Los Angeles, CA', status: 'Inactive' },
  ];

  showNotification = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['created'] === 'true') {
        this.showNotification = true;

        setTimeout(() => {
          this.showNotification = false;
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { created: null },
            queryParamsHandling: 'merge',
          });
        }, 2000);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/SignIn']);
  }
}
