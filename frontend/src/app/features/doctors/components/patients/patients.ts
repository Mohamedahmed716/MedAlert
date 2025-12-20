import {Component, inject, OnInit} from '@angular/core';
import { PatientService } from '../../services/patient-service';
import { Patient } from '../../../../shared/ui/models/patient';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-patients',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
  standalone: true
})
export class Patients implements OnInit {
  private patientService = inject(PatientService);

  searchText: string = '';
  patients: Patient[] = []
  ngOnInit(){
    this.loadPatients();
  }
  loadPatients() {
    this.patientService.getPatients(this.searchText).subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (err) => {
        console.error('Failed to load patients', err);
      }
    });
  }
  onSearch() {
    this.loadPatients();
  }
}
