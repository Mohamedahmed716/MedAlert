import { Component } from '@angular/core';

@Component({
  selector: 'app-prescriptions',
  imports: [],
  templateUrl: './prescriptions.html',
  styleUrl: './prescriptions.css',
  standalone: true
})
export class Prescriptions {
  prescriptions = [
    {patient: 'John Doe', date: '2023-10-24', medication: 'Drug A', dosage: '10mg', frequency: 'Once a day', duration: '30 days'},
    {patient: 'Jane Smith', date: '2023-10-24', medication: 'Drug B', dosage: '5mg', frequency: 'Twice a day', duration: '14 days'},
    {patient: 'Alice Johnson', date: '2023-10-24', medication: 'Drug C', dosage: '20mg', frequency: 'Once a day', duration: '60 days'},
  ];

  showNotification = false;

  sendPrescription() {
    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 2000);
  }
}

