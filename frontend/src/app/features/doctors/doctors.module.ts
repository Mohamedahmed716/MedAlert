import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DOCTOR_ROUTES } from './doctor.routes';
import { Doctors } from './doctors';
import { Dashboard } from './components/dashboard/dashboard';
import { Prescriptions } from './components/prescriptions/prescriptions';
import { Patients } from './components/patients/patients';
import { Reservations } from './components/reservations/reservations';
import { Er } from './components/er/er';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DOCTOR_ROUTES),
    Dashboard,
    Doctors,
    Prescriptions,
    Patients,
    Reservations,
    Er
  ]
})
export class DoctorsModule { }
