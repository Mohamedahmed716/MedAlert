import { Component } from '@angular/core';

@Component({
  selector: 'app-patients',
  imports: [],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients {
  patients = [
    { name: 'John Doe', dob: '1990-05-15', condition: 'Flu', lastVisit: '2024-06-10' },
    { name: 'Jane Smith', dob: '1985-08-22', condition: 'Diabetes', lastVisit: '2024-05-20' },
    { name: 'Emily Johnson', dob: '1978-11-30', condition: 'Hypertension', lastVisit: '2024-04-15' },
    { name: 'Michael Brown', dob: '2000-02-10', condition: 'Asthma', lastVisit: '2024-03-05' },
  ] ;
}
