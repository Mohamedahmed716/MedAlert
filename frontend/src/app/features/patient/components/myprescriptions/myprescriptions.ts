import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-prescriptions',
  imports: [FormsModule,CommonModule],
  templateUrl: './myprescriptions.html',
  styleUrls: ['./myprescriptions.css']
})
export class Myprescriptions {
  searchQuery = '';
  prescriptions = [
    { name: 'Amoxicillin', dosage: '500mg, twice a day', instructions: 'Take with food for 7 days.', doctor: 'Dr. Emily Carter', date: 'Oct 26, 2023' },
    { name: 'Ibuprofen', dosage: '200mg, as needed for pain', instructions: 'Do not exceed 1200mg in 24 hours.', doctor: 'Dr. John Smith', date: 'Oct 22, 2023' },
    { name: 'Lisinopril', dosage: '10mg, once a day', instructions: 'Take in the morning.', doctor: 'Dr. Ben Adams', date: 'Sep 15, 2023' }
  ];

  get filteredPrescriptions() {
    if (!this.searchQuery) return this.prescriptions;
    return this.prescriptions.filter(p =>
      p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      p.doctor.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
