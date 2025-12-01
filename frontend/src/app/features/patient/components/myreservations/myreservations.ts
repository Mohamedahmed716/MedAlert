import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Reservation {
  status: string;
  doctor: string;
  specialty: string;
  clinic: string;
  date: string;
}

@Component({
  selector: 'app-my-reservations',
    imports: [FormsModule,CommonModule],
  templateUrl: './myreservations.html',
  styleUrls: ['./myreservations.css']
})
export class MyReservations {
  searchQuery: string = '';

  upcomingReservations: Reservation[] = [
    {
      status: 'Confirmed',
      doctor: 'Dr. Evelyn Reed',
      specialty: 'Dermatologist',
      clinic: 'City Health Clinic',
      date: 'Tomorrow, 10:30 AM'
    },
    {
      status: 'Confirmed',
      doctor: 'Dr. Ben Carter',
      specialty: 'Pediatrician',
      clinic: 'Oak Valley Hospital',
      date: 'In 3 days, 2:00 PM'
    }
  ];
}
