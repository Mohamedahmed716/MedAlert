import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../doctor.service';
import { ToastService } from '../../../../shared/services/toast.service';

export interface ReservationResponse {
  id: number;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  doctorDepartment: string;
  appointmentTime: string;
  reason: string;
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED';
  declineReason?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-doctor-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class DoctorReservationsComponent implements OnInit {
  private doctorService = inject(DoctorService);
  private toastService = inject(ToastService);

  reservations: ReservationResponse[] = [];
  filteredReservations: ReservationResponse[] = [];
  loading = false;
  
  // Filters
  statusFilter: string = 'ALL';
  searchTerm: string = '';
  activeTab: 'upcoming' | 'all' = 'upcoming';

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    
    const apiCall = this.activeTab === 'upcoming' 
      ? this.doctorService.getUpcomingReservations()
      : this.doctorService.getMyReservations();
    
    apiCall.subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading reservations:', error);
        this.toastService.error('Error', 'Failed to load reservations');
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.reservations];

    // Status filter
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(r => r.status === this.statusFilter);
    }

    // Search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.patientName.toLowerCase().includes(term) ||
        r.reason.toLowerCase().includes(term) ||
        r.patientEmail.toLowerCase().includes(term)
      );
    }

    this.filteredReservations = filtered;
  }

  onFilterChange() {
    this.applyFilters();
  }

  setActiveTab(tab: 'upcoming' | 'all') {
    this.activeTab = tab;
    this.loadReservations(); // Reload data when switching tabs
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'CONFIRMED': return 'status-confirmed';
      case 'DECLINED': return 'status-declined';
      case 'CANCELLED': return 'status-cancelled';
      case 'COMPLETED': return 'status-completed';
      default: return 'status-unknown';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'CONFIRMED': return '✅';
      case 'DECLINED': return '❌';
      case 'CANCELLED': return '🚫';
      case 'COMPLETED': return '✔️';
      default: return '❓';
    }
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString();
  }

  formatDate(dateTime: string): string {
    return new Date(dateTime).toLocaleDateString();
  }

  formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  isUpcoming(reservation: ReservationResponse): boolean {
    return new Date(reservation.appointmentTime) >= new Date();
  }

  trackByReservationId(index: number, reservation: ReservationResponse): number {
    return reservation.id;
  }
}