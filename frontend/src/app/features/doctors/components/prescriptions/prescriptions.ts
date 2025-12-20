import {Component, inject, OnInit} from '@angular/core';
import { ToastService } from '../../../../core/services/toast';
import {Toast} from '../../../../shared/components/toast/toast';
import {Prescription} from '../../../../shared/ui/models/prescription';
import {PrescriptionService} from '../../services/prescription-service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-prescriptions',
  imports: [
    Toast,
    FormsModule
  ],
  templateUrl: './prescriptions.html',
  styleUrl: './prescriptions.css',
  standalone: true
})
export class Prescriptions implements OnInit {
  prescriptions: Prescription[] = [];
  searchtext: string = '';
  private prescriptionService = inject(PrescriptionService);
  private toast = inject(ToastService);

  ngOnInit() {
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.prescriptionService.loadPrescriptions(this.searchtext).subscribe({
      next: (data) => {
        this.prescriptions = data;
      },
      error: (error) => {
        console.error('Error loading prescriptions:', error);
      }
    });
  }

  onSearch(){
    this.loadPrescriptions();
  }

  sendPrescription() {
    // Success
    this.toast.showSuccess('Success', 'Settings saved successfully!');

    // Or Error
    // this.toast.showError('Error', 'Failed to connect to the server.'); 2000);
    // You can customize the title and message as needed
  }

  // toast will be implememnted right with backend calls
}

