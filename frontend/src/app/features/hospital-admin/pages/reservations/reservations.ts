import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css']
})
export class ReservationsComponent {
  showDeclineModal = false;
  declineReason = '';
  showSuccessPopup = false;
  showErrorPopup = false;
  showCopyPopup = false;

  reservation = {
    patientId: 'PT-2025-0891',
    requestId: 'RQ-2025-1147',
    patientName: 'Liam Johnson',
    contact: '(555) 123-4567',
    email: 'liam.johnson@example.com',
    dob: 'October 26, 1988',
    reason: 'Annual check-up and persistent cough...',
    requestType: 'Doctor Appointment',
    doctorName: 'Dr. Ava Chen',
    department: 'Cardiology',
    datetime: 'November 15, 2025 • 10:30 AM'
  };

  constructor(private router: Router) {}

  acceptReservation(): void {
    const [date, time] = this.reservation.datetime.split(' • ');

    // Show success popup
    this.showSuccessPopup = true;

    // Hide popup and navigate after 2 seconds
    setTimeout(() => {
      this.showSuccessPopup = false;
      this.router.navigate(['/hospital-admin/reservations'], {
        state: {
          patientName: this.reservation.patientName,
          date: date,
          time: time,
          department: this.reservation.department
        }
      });
    }, 2000);
  }

  goBack(): void {
    this.router.navigate(['/hospital-admin/dashboard']);
  }

  openDeclineModal(): void {
    this.showDeclineModal = true;
  }

  confirmDecline(): void {
    if (!this.declineReason.trim()) {
      return;
    }

    console.log('Declined with reason:', this.declineReason);

    // Close the modal first
    this.showDeclineModal = false;

    // Show error popup
    this.showErrorPopup = true;

    // Hide popup after 2 seconds and clear the reason
    setTimeout(() => {
      this.showErrorPopup = false;
      this.declineReason = '';
    }, 2000);
  }

  closeModal(): void {
    this.showDeclineModal = false;
    this.declineReason = '';
  }

  contactPatient(): void {
    console.log(`Calling ${this.reservation.contact}...`);
    // You can add your contact logic here
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);

    // Show copy popup
    this.showCopyPopup = true;

    // Hide popup after 2 seconds
    setTimeout(() => {
      this.showCopyPopup = false;
    }, 2000);
  }
}
