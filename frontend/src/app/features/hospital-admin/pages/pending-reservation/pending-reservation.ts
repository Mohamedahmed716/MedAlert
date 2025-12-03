import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/side.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pending-reservation-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, RouterModule],
  templateUrl: './pending-reservation.html',
  styleUrls: ['./pending-reservation.css']
})
export class PendingReservationDetailComponent {
  reservationForm: FormGroup; // ← Declare without initializing

  constructor(private fb: FormBuilder) {
    // ← Initialize inside constructor
    this.reservationForm = this.fb.group({
      declineReason: ['']
    });
  }

  onAccept() {

  }

  onDecline() {

  }

  contactPatient() {
  }
}
