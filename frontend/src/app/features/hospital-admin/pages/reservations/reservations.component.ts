import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HospitalAdminService, ReservationResponse, ReservationActionRequest } from '../../services/hospital-admin.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-reservations-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsManagementComponent implements OnInit {
  private hospitalAdminService = inject(HospitalAdminService);
  private toastService = inject(ToastService);

  reservations: ReservationResponse[] = [];
  filteredReservations: ReservationResponse[] = [];
  loading = false;
  
  // Filters
  statusFilter: string = 'ALL';
  searchTerm: string = '';
  
  // Modal for decline reason
  showDeclineModal = false;
  selectedReservation: ReservationResponse | null = null;
  declineReason = '';

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.hospitalAdminService.getAllReservations().subscribe({
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
        r.doctorName.toLowerCase().includes(term) ||
        r.reason.toLowerCase().includes(term)
      );
    }

    this.filteredReservations = filtered;
  }

  onFilterChange() {
    this.applyFilters();
  }

  acceptReservation(reservation: ReservationResponse) {
    this.toastService.confirm(
      'Accept Reservation',
      `Accept reservation for ${reservation.patientName} with ${reservation.doctorName}?`,
      () => {
        this.processReservation(reservation.id, { action: 'ACCEPT' });
      }
    );
  }

  declineReservation(reservation: ReservationResponse) {
    this.selectedReservation = reservation;
    this.declineReason = '';
    this.showDeclineModal = true;
  }

  confirmDecline() {
    if (!this.selectedReservation) return;
    
    if (!this.declineReason.trim()) {
      this.toastService.error('Error', 'Please provide a reason for declining');
      return;
    }

    this.processReservation(this.selectedReservation.id, {
      action: 'DECLINE',
      declineReason: this.declineReason
    });

    this.closeDeclineModal();
  }

  closeDeclineModal() {
    this.showDeclineModal = false;
    this.selectedReservation = null;
    this.declineReason = '';
  }

  private processReservation(reservationId: number, request: ReservationActionRequest) {
    this.hospitalAdminService.processReservation(reservationId, request).subscribe({
      next: (updatedReservation) => {
        // Update the reservation in the list
        const index = this.reservations.findIndex(r => r.id === reservationId);
        if (index !== -1) {
          this.reservations[index] = updatedReservation;
          this.applyFilters();
        }

        const action = request.action === 'ACCEPT' ? 'accepted' : 'declined';
        this.toastService.success('Success', `Reservation ${action} successfully`);
      },
      error: (error) => {
        console.error('Error processing reservation:', error);
        this.toastService.error('Error', 'Failed to process reservation');
      }
    });
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

  trackByReservationId(index: number, reservation: ReservationResponse): number {
    return reservation.id;
  }
}