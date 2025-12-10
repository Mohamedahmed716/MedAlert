import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserService, User, UserStats } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-mangment.component.html',
  styleUrls: ['./user-mangment.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  paginatedUsers: User[] = [];

  stats: UserStats = {
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
  };

  currentPage = 1;
  itemsPerPage = 3;

  showNotification = false;

  showConfirmModal = false;
  selectedUserId: number | null = null;
  actionType: 'delete' | 'toggle' | null = null;
  targetStatus: boolean = false;
  confirmTitle = '';
  confirmMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadStats();

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
        }, 3000);
      }
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.updatePagination();
      },
      error: (err) => console.error('Failed to load users', err),
    });
  }

  loadStats() {
    this.userService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Failed to load stats', err),
    });
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.users.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  get showStart(): number {
    if (this.users.length === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get showEnd(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.users.length ? this.users.length : end;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/SignIn']);
  }

  onEdit(id: number) {
    this.router.navigate(['/admin/users/edit', id]);
  }

  initiateDelete(id: number) {
    this.selectedUserId = id;
    this.actionType = 'delete';
    this.confirmTitle = 'Delete User Account?';
    this.confirmMessage =
      'Are you sure you want to delete this user? This action cannot be undone.';
    this.showConfirmModal = true;
  }

  initiateToggleStatus(user: User) {
    this.selectedUserId = user.id;
    this.actionType = 'toggle';
    this.targetStatus = !user.active;

    const actionWord = this.targetStatus ? 'Activate' : 'Deactivate';
    this.confirmTitle = `${actionWord} User Account?`;
    this.confirmMessage = `Are you sure you want to ${actionWord.toLowerCase()} the account for ${
      user.fullName
    }?`;

    this.showConfirmModal = true;
  }

  confirmAction() {
    if (this.selectedUserId === null) {
      return;
    }

    if (this.actionType === 'delete') {
      this.userService.deleteUser(this.selectedUserId).subscribe({
        next: () => {
          this.loadUsers();
          this.loadStats();
          this.closeModal();
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert(`Delete Failed: ${err.message || 'Unknown error'}`);
          this.closeModal();
        },
      });
    } else if (this.actionType === 'toggle') {
      this.userService.toggleStatus(this.selectedUserId, this.targetStatus).subscribe({
        next: () => {
          this.loadUsers();
          this.loadStats();
          this.closeModal();
        },
        error: (err) => {
          console.error('Status toggle failed:', err);
          alert(`Status Update Failed: ${err.message || 'Unknown error'}`);
          this.closeModal();
        },
      });
    }
  }

  closeModal() {
    this.showConfirmModal = false;
    this.selectedUserId = null;
    this.actionType = null;
  }
}
