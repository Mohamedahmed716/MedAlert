import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reservation,PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myreservations.html',
  styleUrls: ['./myreservations.css']
})
export class MyReservations implements OnInit {
  activeTab: 'upcoming' | 'past' = 'upcoming';
  searchText = '';
  reservations: Reservation[] = []; // Uses the interface from PatientService

  constructor(private PatientService: PatientService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.PatientService.getMyReservations().subscribe({
      next: (data) => this.reservations = data,
      error: (err) => console.error('Data load error:', err)
    });
  }

  // Uses 'patientName' which holds the Doctor's name from backend DTO
  get filteredUpcoming() {
    return this.reservations.filter(r => 
      r.status !== 'CANCELLED' && 
      r.patientName?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get filteredPast() {
    return this.reservations.filter(r => 
      r.status === 'CANCELLED' && 
      r.patientName?.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  switchTab(tab: 'upcoming' | 'past') {
    this.activeTab = tab;
  }

  cancel(res: Reservation) {
    if (res.id && confirm('Cancel this appointment?')) {
      this.PatientService.cancelReservation(res.id).subscribe(() => this.loadData());
    }
  }

  reschedule(res: Reservation) {
    alert('Reschedule logic is not yet implemented on backend.');
  }
}