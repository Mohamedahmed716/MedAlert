import {Component, inject} from '@angular/core';
import { ToastService } from '../../../../core/services/toast';
import {Toast} from '../../../../shared/components/toast/toast';

@Component({
  selector: 'app-prescriptions',
  imports: [
    Toast
  ],
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
  private toast = inject(ToastService);

  sendPrescription() {
    // Success
    this.toast.showSuccess('Success', 'Settings saved successfully!');

    // Or Error
    // this.toast.showError('Error', 'Failed to connect to the server.'); 2000);
    // You can customize the title and message as needed
  }

  // toast will be implememnted right with backend calls
}

