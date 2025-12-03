import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationExtras,RouterModule  } from '@angular/router';

@Component({
  selector: 'app-reservation-accepted',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './reservation-confirmation.html',
  styleUrls: ['./reservation-confirmation.css']
})
export class ReservationAcceptedComponent implements OnInit {

  reservation = {
    patientName: 'Patient',
    date: 'Date',
    time: 'Time',
    department: 'Department'
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as any;

    if (state) {
      this.reservation = {
        patientName: state.patientName || 'Patient',
        date: state.date || 'N/A',
        time: state.time || 'N/A',
        department: state.department || 'N/A'
      };
    } else {
      // Fallback: read from history.state (in case of refresh)
      const fallbackState = history.state;
      if (fallbackState?.patientName) {
        this.reservation = {
          patientName: fallbackState.patientName,
          date: fallbackState.date || 'N/A',
          time: fallbackState.time || 'N/A',
          department: fallbackState.department || 'N/A'
        };
      }
    }
  }
}
