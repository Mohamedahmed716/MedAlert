import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PatientService, ReservationResponse } from '../../services/patient.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './myreservations.html',
  styleUrls: ['./myreservations.css']
})
export class MyReservations implements OnInit {
  private patientService = inject(PatientService);
  private toastService = inject(ToastService);

  activeTab: 'upcoming' | 'past' = 'upcoming';
  searchText = '';
  reservations: ReservationResponse[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.patientService.getMyReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Data load error:', err);
        this.toastService.error('Error', 'Failed to load reservations');
        this.loading = false;
      }
    });
  }

  get filteredUpcoming() {
    const now = new Date();
    return this.reservations.filter(r => 
      new Date(r.appointmentTime) >= now &&
      (r.status === 'PENDING' || r.status === 'CONFIRMED') &&
      r.doctorName?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get filteredPast() {
    const now = new Date();
    return this.reservations.filter(r => 
      (new Date(r.appointmentTime) < now || r.status === 'CANCELLED' || r.status === 'COMPLETED' || r.status === 'DECLINED') &&
      r.doctorName?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  switchTab(tab: 'upcoming' | 'past') {
    this.activeTab = tab;
  }

  cancel(res: ReservationResponse) {
    if (res.status !== 'PENDING' && res.status !== 'CONFIRMED') {
      this.toastService.error('Error', 'Only pending or confirmed reservations can be cancelled');
      return;
    }

    this.toastService.confirm(
      'Cancel Reservation',
      `Are you sure you want to cancel your appointment with ${res.doctorName}?`,
      () => {
        this.patientService.cancelReservation(res.id).subscribe({
          next: () => {
            this.toastService.success('Success', 'Reservation cancelled successfully');
            this.loadData();
          },
          error: (err) => {
            console.error('Cancel error:', err);
            this.toastService.error('Error', 'Failed to cancel reservation');
          }
        });
      }
    );
  }

  reschedule(res: ReservationResponse) {
    this.toastService.error('Not Available', 'Reschedule functionality is not yet implemented');
  }

  formatDate(dateTime: string): string {
    return new Date(dateTime).toLocaleDateString();
  }

  formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  canCancel(reservation: ReservationResponse): boolean {
    return reservation.status === 'PENDING' || reservation.status === 'CONFIRMED';
  }
}