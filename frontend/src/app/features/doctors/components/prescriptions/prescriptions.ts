import {Component, inject, OnInit} from '@angular/core';
import {ToastService} from '../../../../core/services/toast';
import {Toast} from '../../../../shared/components/toast/toast';
import {Prescription} from '../../../../shared/ui/models/prescription';
import {PrescriptionService} from '../../services/prescription-service';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {DurationTime} from '../../../../shared/ui/models/enums';

@Component({
  selector: 'app-prescriptions',
  imports: [Toast, FormsModule, CommonModule],
  templateUrl: './prescriptions.html',
  styleUrl: './prescriptions.css',
  standalone: true
})
export class Prescriptions implements OnInit {
  prescriptions: Prescription[] = [];
  searchtext: string = '';

  newPrescription : Prescription = {
    patientName: '',
    medicationName: '',
    dosage: '',
    frequency: 'Once daily',
    duration: 0,
    durationTime: DurationTime.DAYS,
    instructions: ''
  };

  isFormSubmitted = false;

  private prescriptionService = inject(PrescriptionService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchtext = params['search'];
      }
    })
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.prescriptionService.loadPrescriptions(this.searchtext).subscribe({
      next: (data) => this.prescriptions = data,
      error: (error) => console.error('Error loading prescriptions:', error)
    });
  }

  onSearch() {
    this.loadPrescriptions();
  }

  sendPrescription() {
    this.isFormSubmitted = true;

    if (!this.isValid()) {
      this.toast.showError('Error', 'Please fill in all required fields.');
      return;
    }

    this.prescriptionService.createPrescription(this.newPrescription).subscribe({
      next: (response) => {
        this.toast.showSuccess('Success', 'Prescription sent successfully!');
        this.resetForm();
        this.loadPrescriptions();
      },
      error: (err) => {
        this.toast.showError('Error', err.error.message);
        console.error(err);
      }
    });
  }

  isValid(): boolean {
    return !!(
      this.newPrescription.patientName &&
      this.newPrescription.medicationName &&
      this.newPrescription.dosage &&
      this.newPrescription.frequency &&
      this.newPrescription.duration &&
      this.newPrescription.durationTime
    );
  }

  resetForm() {
    this.isFormSubmitted = false;
    this.newPrescription = {
      patientName: '',
      medicationName: '',
      dosage: '',
      frequency: 'Once daily',
      duration: 0,
      durationTime: DurationTime.DAYS,
      instructions: ''
    };
  }
}
