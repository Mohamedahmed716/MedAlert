import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { HospitalService } from '../../../core/services/hospital.service';
import { Hospital, HospitalStats } from '../../../shared/ui/models/auth.models';

@Component({
  selector: 'app-system-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class SystemAdminDashboardComponent implements OnInit {
  hospitals: Hospital[] = [];
  paginatedHospitals: Hospital[] = [];

  stats: HospitalStats = {
    totalHospitals: 0,
    operational: 0,
    maintenance: 0,
  };

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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadHospitals();
    this.loadStats();

    this.route.queryParams.subscribe((params) => {
      if (params['created'] === 'true') {
        this.showNotification = true;
        setTimeout(() => (this.showNotification = false), 4000);
      }
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

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedHospitals = this.hospitals.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.hospitals.length) {
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
    if (this.hospitals.length === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get showEnd(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.hospitals.length ? this.hospitals.length : end;
  }

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
