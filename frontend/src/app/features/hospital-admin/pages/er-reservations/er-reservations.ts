import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Bed {
  id: string;
  number: string;
  status: 'available' | 'occupied';
  patientName?: string;
  admittedAt?: string;
}

@Component({
  selector: 'app-er-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './er-reservations.html',
  styleUrls: ['./er-reservations.css']
})
export class ErReservationsComponent {
  showModal = false;
  selectedBed: Bed | null = null;

  beds: Bed[] = [
    { id: '1', number: 'ER-01', status: 'available' },
    { id: '2', number: 'ER-02', status: 'occupied', patientName: 'John Doe', admittedAt: '2 hours ago' },
    { id: '3', number: 'ER-03', status: 'available' },
    { id: '4', number: 'ER-04', status: 'available' },
    { id: '5', number: 'ER-05', status: 'occupied', patientName: 'Maria Garcia', admittedAt: '45 min ago' },
    { id: '6', number: 'ER-06', status: 'available' },
    { id: '7', number: 'ER-07', status: 'occupied', patientName: 'Ahmed Khan', admittedAt: '3 hours ago' },
    { id: '8', number: 'ER-08', status: 'occupied', patientName: 'Lisa Chen', admittedAt: '1 hour ago' },
    { id: '9', number: 'ER-09', status: 'available' },
    { id: '10', number: 'ER-10', status: 'available' }
  ];

  get availableCount(): number {
    return this.beds.filter(b => b.status === 'available').length;
  }

  get occupiedCount(): number {
    return this.beds.filter(b => b.status === 'occupied').length;
  }

  openModal(bed: Bed): void {
    this.selectedBed = bed;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedBed = null;
  }

  confirmChange(): void {
    if (!this.selectedBed) return;

    // Toggle status
    this.selectedBed.status = this.selectedBed.status === 'available' ? 'occupied' : 'available';

    // Auto-fill patient info when occupying
    if (this.selectedBed.status === 'occupied' && !this.selectedBed.patientName) {
      this.selectedBed.patientName = 'New Patient';
      this.selectedBed.admittedAt = 'Just now';
    }

    // Clear patient info when freeing bed
    if (this.selectedBed.status === 'available') {
      this.selectedBed.patientName = undefined;
      this.selectedBed.admittedAt = undefined;
    }

    this.closeModal();
  }
}
