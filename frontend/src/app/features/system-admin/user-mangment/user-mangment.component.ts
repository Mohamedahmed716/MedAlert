import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  dateCreated: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-mangment.component.html',
  styleUrls: ['./user-mangment.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [
    {
      id: 1,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Patient',
      isActive: true,
      dateCreated: '2023-01-15',
    },
    {
      id: 2,
      fullName: 'Jane Smith',
      email: 'jane.smith@hospital.org',
      role: 'Hospital Admin',
      isActive: true,
      dateCreated: '2022-11-20',
    },
    {
      id: 3,
      fullName: 'Sam Wilson',
      email: 'sam.wilson@medalert.io',
      role: 'Super Admin',
      isActive: false,
      dateCreated: '2021-03-10',
    },
    {
      id: 4,
      fullName: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      role: 'Patient',
      isActive: true,
      dateCreated: '2023-05-01',
    },
  ];

  showNotification = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check URL for ?created=true to show success banner
    this.route.queryParams.subscribe((params) => {
      if (params['created'] === 'true') {
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
          // Clear the query param
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

  approveUser(user: User) {
    if (confirm(`Approve account for ${user.fullName}?`)) {
      console.log('Approving:', user.fullName);
      user.isActive = true;
    }
  }

  deactivateUser(user: User) {
    if (confirm(`Deactivate account for ${user.fullName}?`)) {
      console.log('Deactivating:', user.fullName);
      user.isActive = false;
    }
  }
}
