import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/side.component';
import { RouterModule, Router } from '@angular/router';
import { HospitalAdminService, ReservationResponse, ReservationActionRequest } from '../../services/hospital-admin.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-pending-reservation-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, RouterModule],
  templateUrl: './pending-reservation.html',
  styleUrls: ['./pending-reservation.css']
})
export class PendingReservationDetailComponent implements OnInit {
  private hospitalAdminService = inject(HospitalAdminService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  reservationForm: FormGroup;
  pendingReservations: ReservationResponse[] = [];
  loading = false;

  constructor() {
    this.reservationForm = this.fb.group({
      declineReason: ['']
    });
  }

  ngOnInit() {
    this.loadPendingReservations();
  }

  loadPendingReservations() {
    this.loading = true;
    this.hospitalAdminService.getPendingReservations().subscribe({
      next: (reservations) => {
        this.pendingReservations = reservations;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pending reservations:', error);
        this.toastService.error('Error', 'Failed to load pending reservations');
        this.loading = false;
      }
    });
  }

  onAccept(reservation: ReservationResponse) {
    this.toastService.confirm(
      'Accept Reservation',
      `Accept reservation for ${reservation.patientName} with ${reservation.doctorName}?`,
      () => {
        this.processReservation(reservation.id, { action: 'ACCEPT' });
      }
    );
  }

  onDecline(reservation: ReservationResponse) {
    const declineReason = this.reservationForm.get('declineReason')?.value?.trim();
    
    if (!declineReason) {
      this.toastService.error('Error', 'Please provide a reason for declining');
      return;
    }

    this.toastService.confirm(
      'Decline Reservation',
      `Decline reservation for ${reservation.patientName}?`,
      () => {
        this.processReservation(reservation.id, {
          action: 'DECLINE',
          declineReason: declineReason
        });
      }
    );
  }

  private processReservation(reservationId: number, request: ReservationActionRequest) {
    this.hospitalAdminService.processReservation(reservationId, request).subscribe({
      next: (updatedReservation) => {
        const action = request.action === 'ACCEPT' ? 'accepted' : 'declined';
        this.toastService.success('Success', `Reservation ${action} successfully`);
        
        // Remove the processed reservation from the list
        this.pendingReservations = this.pendingReservations.filter(r => r.id !== reservationId);
        
        // Reset form
        this.reservationForm.reset();
      },
      error: (error) => {
        console.error('Error processing reservation:', error);
        this.toastService.error('Error', 'Failed to process reservation');
      }
    });
  }

  contactPatient(reservation: ReservationResponse) {
    // Open email client with patient's email
    const subject = `Regarding your appointment reservation #${reservation.id}`;
    const body = `Dear ${reservation.patientName},\n\nRegarding your appointment reservation with ${reservation.doctorName}...\n\nBest regards,\nHospital Administration`;
    const mailtoLink = `mailto:${reservation.patientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
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
}
