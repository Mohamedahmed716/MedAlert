import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrescriptionService } from '../../services/prescription.service';
import { Prescription } from '../../../../shared/ui/models/prescription';


@Component({
  selector: 'app-my-prescriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './myprescriptions.html',
  styleUrls: ['./myprescriptions.css']
})
export class Myprescriptions implements OnInit {
  searchText: string = "";
  prescriptions: Prescription[] = []; 

  constructor(private prescriptionService: PrescriptionService) {}

  ngOnInit(): void {
    this.prescriptionService.getMyPrescriptions().subscribe({
      next: (data) => this.prescriptions = data,
      error: (err) => console.error('Error loading prescriptions', err)
    });
  }

  get filteredPrescriptions() {
    return this.prescriptions.filter(p => 
      p.medicationName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  printPrescription(p: Prescription) {
    window.print();
  }

  viewPrescription(p: Prescription) {
    alert(`Details for ${p.medicationName}: ${p.instructions}`);
  }
}