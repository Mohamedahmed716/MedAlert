import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-prescriptions',
  imports:[CommonModule,FormsModule],
  templateUrl: './myprescriptions.html',
  styleUrls: ['./myprescriptions.css']
})
export class Myprescriptions {

  searchText: string = "";

  prescriptions = [
    {
      name: "Amoxicillin",
      dosage: "500mg, twice a day",
      instructions: "Take with food for 7 days.",
      doctor: "Dr. Emily Carter",
      date: "October 26, 2023"
    },
    {
      name: "Ibuprofen",
      dosage: "200mg, as needed for pain",
      instructions: "Do not exceed 1200mg in 24 hours.",
      doctor: "Dr. John Smith",
      date: "October 22, 2023"
    },
    {
      name: "Lisinopril",
      dosage: "10mg, once a day",
      instructions: "Take in the morning.",
      doctor: "Dr. Ben Adams",
      date: "September 15, 2023"
    }
  ];

  printPrescription(p: any) {
    alert("Printing: " + p.name);
  }

  viewPrescription(p: any) {
    alert("Viewing details for: " + p.name);
  }

}
