import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
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
  selector: 'app-patient-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class PatientReservationsComponent implements OnInit {
  private patientService = inject(PatientService);
  private toastService = inject(ToastService);

  reservations: ReservationResponse[] = [];
  filteredReservations: ReservationResponse[] = [];
  loading = false;
  
  // Filters
  statusFilter: string = 'ALL';
  searchTerm: string = '';
  activeTab: 'upcoming' | 'past' = 'upcoming';

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations() {
    this.loading = true;
    this.patientService.getMyReservations().subscribe({
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

    // Tab filter (upcoming vs past)
    const now = new Date();
    if (this.activeTab === 'upcoming') {
      filtered = filtered.filter(r => new Date(r.appointmentTime) >= now);
    } else {
      filtered = filtered.filter(r => new Date(r.appointmentTime) < now);
    }

    // Status filter
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(r => r.status === this.statusFilter);
    }

    // Search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r => 
        r.doctorName.toLowerCase().includes(term) ||
        r.reason.toLowerCase().includes(term) ||
        r.doctorDepartment.toLowerCase().includes(term)
      );
    }

    this.filteredReservations = filtered;
  }

  onFilterChange() {
    this.applyFilters();
  }

  setActiveTab(tab: 'upcoming' | 'past') {
    this.activeTab = tab;
    this.applyFilters();
  }

  cancelReservation(reservation: ReservationResponse) {
    if (reservation.status !== 'PENDING' && reservation.status !== 'CONFIRMED') {
      this.toastService.error('Error', 'Only pending or confirmed reservations can be cancelled');
      return;
    }

    this.toastService.confirm(
      'Cancel Reservation',
      `Are you sure you want to cancel your appointment with ${reservation.doctorName}?`,
      () => {
        this.patientService.cancelReservation(reservation.id).subscribe({
          next: (updatedReservation) => {
            // Update the reservation in the list
            const index = this.reservations.findIndex(r => r.id === reservation.id);
            if (index !== -1) {
              this.reservations[index] = updatedReservation;
              this.applyFilters();
            }
            this.toastService.success('Success', 'Reservation cancelled successfully');
          },
          error: (error) => {
            console.error('Error cancelling reservation:', error);
            this.toastService.error('Error', 'Failed to cancel reservation');
          }
        });
      }
    );
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

  canCancel(reservation: ReservationResponse): boolean {
    return reservation.status === 'PENDING' || reservation.status === 'CONFIRMED';
  }

  trackByReservationId(index: number, reservation: ReservationResponse): number {
    return reservation.id;
  }
}