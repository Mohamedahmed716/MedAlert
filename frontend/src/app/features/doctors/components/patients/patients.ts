import {Component, inject, OnInit} from '@angular/core';
import { PatientService } from '../../services/patient-service';
import { Patient } from '../../../../shared/ui/models/patient';

@Component({
  selector: 'app-patients',
  imports: [],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
  standalone: true
})
export class Patients implements OnInit {
  private patientService = inject(PatientService);
  ngOnInit(){
    this.loadPatients();
  }
  loadPatients() {
    this.patientService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (err) => {
        console.error('Failed to load patients', err);
      }
    });
  }
  patients: Patient[] = []
}
