import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Reservation {
  status: 'Confirmed' | 'Cancelled';
  doctor: string;
  specialty: string;
  location: string;
  timeLabel: string;     // e.g. "Tomorrow, 10:30 AM"
  isUpcoming: boolean;
}

@Component({
  selector: 'app-my-reservations',
  imports:[CommonModule,FormsModule],
  templateUrl: './myreservations.html',
  styleUrls: ['./myreservations.css']
})
export class MyReservations {

  activeTab: 'upcoming' | 'past' = 'upcoming';
  searchText = '';

  reservations: Reservation[] = [
    {
      status: 'Confirmed',
      doctor: 'Dr. Evelyn Reed',
      specialty: 'Dermatologist',
      location: 'City Health Clinic',
      timeLabel: 'Tomorrow, 10:30 AM',
      isUpcoming: true
    },
    {
      status: 'Confirmed',
      doctor: 'Dr. Ben Carter',
      specialty: 'Pediatrician',
      location: 'Oak Valley Hospital',
      timeLabel: 'In 3 days, 2:00 PM',
      isUpcoming: true
    },
    {
      status: 'Cancelled',
      doctor: 'Dr. Michael Brown',
      specialty: 'Cardiologist',
      location: 'St. Jude Medical Center',
      timeLabel: 'September 10, 2023, 09:00 AM',
      isUpcoming: false
    }
  ];

  get filteredUpcoming() {
    return this.reservations
      .filter(r => r.isUpcoming)
      .filter(r =>
        r.doctor.toLowerCase().includes(this.searchText.toLowerCase())
      );
  }

  get filteredPast() {
    return this.reservations
      .filter(r => !r.isUpcoming)
      .filter(r =>
        r.doctor.toLowerCase().includes(this.searchText.toLowerCase())
      );
  }

  switchTab(tab: 'upcoming' | 'past') {
    this.activeTab = tab;
    this.searchText = '';
  }

  reschedule(res: Reservation) {
    alert(`Reschedule ${res.doctor}'s appointment (${res.timeLabel})`);
  }

  cancel(res: Reservation) {
    alert(`Cancel appointment with ${res.doctor}`);
  }
}
