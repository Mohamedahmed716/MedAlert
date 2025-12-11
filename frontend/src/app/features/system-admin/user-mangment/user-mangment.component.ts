import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { UserService, UserStats } from '../../../core/services/user.service';
import { User } from '../../../shared/ui/models/auth.models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-mangment.component.html',
  styleUrls: ['./user-mangment.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];

  stats: UserStats = {
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
  };

  profilePhotoUrl: string = 'assets/default.png';

  // --- SEARCH & FILTER STATE ---
  searchTerm: string = '';
  suggestions: User[] = [];
  showSuggestions: boolean = false;

  // Status Filter
  filterStatus: 'All' | 'Active' | 'Pending' = 'All';
  showFilterMenu: boolean = false;

  // NEW: Role Filter
  filterRole: string = 'All';
  showRoleFilterMenu: boolean = false;
  roleOptions = ['All', 'Patient', 'Doctor', 'Hospital Admin', 'System Admin'];

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
    private route: ActivatedRoute,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
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

  // --- SEARCH LOGIC ---
  onSearchChange() {
    this.applyFilters();
    this.showSuggestions = this.searchTerm.length > 0 && this.filteredUsers.length > 0;
    this.suggestions = this.filteredUsers.slice(0, 5);
  }

  selectSuggestion(user: User) {
    this.searchTerm = user.fullName;
    this.showSuggestions = false;
    this.applyFilters();
  }

  // --- FILTER LOGIC ---

  // Status Filter
  toggleFilterMenu() {
    this.showFilterMenu = !this.showFilterMenu;
    this.showRoleFilterMenu = false; // Close other menu
  }

  setFilter(status: 'All' | 'Active' | 'Pending') {
    this.filterStatus = status;
    this.showFilterMenu = false;
    this.applyFilters();
  }

  // NEW: Role Filter
  toggleRoleFilterMenu() {
    this.showRoleFilterMenu = !this.showRoleFilterMenu;
    this.showFilterMenu = false; // Close other menu
  }

  setRoleFilter(role: string) {
    this.filterRole = role;
    this.showRoleFilterMenu = false;
    this.applyFilters();
  }

  // Unified Filter Application
  applyFilters() {
    let temp = [...this.users];

    // 1. Filter by Status
    if (this.filterStatus === 'Active') {
      temp = temp.filter((u) => u.active);
    } else if (this.filterStatus === 'Pending') {
      temp = temp.filter((u) => !u.active);
    }

    // 2. Filter by Role (NEW)
    if (this.filterRole !== 'All') {
      // Convert friendly name to backend ENUM format (e.g. "Hospital Admin" -> "HOSPITAL_ADMIN")
      const backendRole = this.filterRole.toUpperCase().replace(' ', '_');
      temp = temp.filter((u) => u.role === backendRole);
    }

    // 3. Filter by Search Term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(
        (u) => u.fullName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
      );
    }

    this.filteredUsers = temp;
    this.currentPage = 1;
    this.updatePagination();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showSuggestions = false;
      this.showFilterMenu = false;
      this.showRoleFilterMenu = false;
    }
  }

  // --- DATA LOADING ---
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
      error: () => {
        this.profilePhotoUrl = 'assets/default.png';
      },
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.updatePagination();
      },
      error: (err) => console.error('Failed to load users', err),
    });
  }

  loadStats() {
    this.userService.getStats().subscribe({
      next: (data) => (this.stats = data),
      error: (err) => console.error('Failed to load stats', err),
    });
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.filteredUsers.length) {
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
    if (this.filteredUsers.length === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get showEnd(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredUsers.length ? this.filteredUsers.length : end;
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
    if (this.selectedUserId === null) return;

    if (this.actionType === 'delete') {
      this.userService.deleteUser(this.selectedUserId).subscribe({
        next: () => {
          this.loadUsers();
          this.loadStats();
          this.closeModal();
        },
        error: (err) => {
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
