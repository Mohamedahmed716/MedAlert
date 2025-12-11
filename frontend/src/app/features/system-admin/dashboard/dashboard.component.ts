import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is imported
import { AuthService } from '../../auth/auth.service';
import { HospitalService } from '../../../core/services/hospital.service';
import { UserService } from '../../../core/services/user.service';
import { Hospital, HospitalStats } from '../../../shared/ui/models/auth.models';

@Component({
  selector: 'app-system-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class SystemAdminDashboardComponent implements OnInit {
  hospitals: Hospital[] = []; // Raw data
  filteredHospitals: Hospital[] = []; // Data after filter/search
  paginatedHospitals: Hospital[] = []; // Data for current page

  stats: HospitalStats = {
    totalHospitals: 0,
    operational: 0,
    maintenance: 0,
  };

  profilePhotoUrl: string = 'assets/default.png';

  // --- SEARCH & FILTER STATE ---
  searchTerm: string = '';
  suggestions: Hospital[] = [];
  showSuggestions: boolean = false;

  filterStatus: 'All' | 'Active' | 'Inactive' = 'All';
  showFilterMenu: boolean = false;
  // -----------------------------

  currentPage = 1;
  itemsPerPage = 3;

  showNotification = false;
  showConfirmModal = false;

  selectedHospitalId: string | null = null;
  actionType: 'delete' | 'toggle' | null = null;
  targetStatus: string = '';
  confirmMessage: string = '';
  confirmTitle: string = '';

  constructor(
    private authService: AuthService,
    private hospitalService: HospitalService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadHospitals();
    this.loadStats();

    this.route.queryParams.subscribe((params) => {
      if (params['created'] === 'true') {
        this.showNotification = true;
        setTimeout(() => (this.showNotification = false), 4000);
      }
    });
  }

  // --- SEARCH LOGIC ---
  onSearchChange() {
    this.applyFilters();
    // Show suggestions if input exists and results found
    this.showSuggestions = this.searchTerm.length > 0 && this.filteredHospitals.length > 0;
    this.suggestions = this.filteredHospitals.slice(0, 5); // Limit to 5
  }

  selectSuggestion(hospital: Hospital) {
    this.searchTerm = hospital.name;
    this.showSuggestions = false;
    this.applyFilters();
  }

  // --- FILTER LOGIC ---
  toggleFilterMenu() {
    this.showFilterMenu = !this.showFilterMenu;
  }

  setFilter(status: 'All' | 'Active' | 'Inactive') {
    this.filterStatus = status;
    this.showFilterMenu = false;
    this.applyFilters();
  }

  applyFilters() {
    let temp = [...this.hospitals];

    // 1. Filter by Status
    if (this.filterStatus !== 'All') {
      temp = temp.filter((h) => h.status === this.filterStatus);
    }

    // 2. Filter by Search (Name, City, or State)
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(
        (h) =>
          h.name.toLowerCase().includes(term) ||
          (h.city && h.city.toLowerCase().includes(term)) ||
          (h.state && h.state.toLowerCase().includes(term))
      );
    }

    this.filteredHospitals = temp;
    this.currentPage = 1; // Reset to first page
    this.updatePagination();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showSuggestions = false;
      this.showFilterMenu = false;
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
      error: (err) => {
        this.profilePhotoUrl = 'assets/default.png';
      },
    });
  }

  loadHospitals() {
    this.hospitalService.getHospitals().subscribe({
      next: (data) => {
        this.hospitals = data.map((h) => ({
          ...h,
          location: `${h.city}, ${h.state}`,
          status: h.status || 'Active',
        }));
        this.filteredHospitals = this.hospitals; // Init filtered list
        this.updatePagination();
      },
      error: (err) => console.error(err),
    });
  }

  loadStats() {
    this.hospitalService.getStats().subscribe({
      next: (data) => (this.stats = data),
      error: (err) => console.error(err),
    });
  }

  // --- PAGINATION ---
  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    // Use filtered list for pagination
    this.paginatedHospitals = this.filteredHospitals.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.filteredHospitals.length) {
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
    if (this.filteredHospitals.length === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get showEnd(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.filteredHospitals.length ? this.filteredHospitals.length : end;
  }

  // --- ACTIONS ---
  onEdit(id: number | string) {
    this.router.navigate(['/admin/hospitals/edit', id.toString()]);
  }

  initiateDelete(id: number | string) {
    this.selectedHospitalId = id.toString();
    this.actionType = 'delete';
    this.confirmTitle = 'Delete Hospital?';
    this.confirmMessage =
      'Are you sure you want to delete this hospital? This action cannot be undone.';
    this.showConfirmModal = true;
  }

  initiateToggleStatus(hospital: Hospital) {
    this.selectedHospitalId = hospital.id?.toString() || '';
    this.actionType = 'toggle';
    this.targetStatus = hospital.status === 'Active' ? 'Inactive' : 'Active';

    this.confirmTitle = `${this.targetStatus === 'Active' ? 'Activate' : 'Deactivate'} Hospital?`;
    this.confirmMessage = `Are you sure you want to change the status to ${this.targetStatus}?`;
    this.showConfirmModal = true;
  }

  confirmAction() {
    if (!this.selectedHospitalId) return;

    if (this.actionType === 'delete') {
      this.hospitalService.deleteHospital(this.selectedHospitalId).subscribe({
        next: () => {
          this.loadHospitals();
          this.loadStats();
          this.closeModal();
        },
        error: (err) => console.error('Delete failed', err),
      });
    } else if (this.actionType === 'toggle') {
      this.hospitalService.toggleStatus(this.selectedHospitalId, this.targetStatus).subscribe({
        next: () => {
          this.loadHospitals();
          this.loadStats();
          this.closeModal();
        },
        error: (err) => console.error('Status toggle failed', err),
      });
    }
  }

  closeModal() {
    this.showConfirmModal = false;
    this.selectedHospitalId = null;
    this.actionType = null;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/SignIn']);
  }
}
