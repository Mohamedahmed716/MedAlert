import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Patient } from './patients';
import { Dashboard } from './components/dashboard/dashboard';
import { Findhospital } from './components/findhospital/findhospital';
import { Myprescriptions } from './components/myprescriptions/myprescriptions';
import { MyReservations } from './components/myreservations/myreservations';
import { Settings } from './components/settings/settings';
import { Hospitaldashboard } from './components/hospitaldashboard/hospitaldashboard';
import { Departmentview } from './components/departmentview/departmentview';
import { Hospitaldepartments } from './components/hospitaldepartments/hospitaldepartments';
import { Doctorprofile } from './components/doctorprofile/doctorprofile';
import { ReservationConfirmComponent } from './components/reservationconfirmation/reservationconfirmation';
import { Er } from './components/er/er';
import { BookAppointmentComponent } from './pages/book-appointment/book-appointment.component';

const routes: Routes = [
  { path: '', component: Patient ,
  children: [
        {path: 'dashboard', component: Dashboard},
        {path: 'findhospital', component: Findhospital},
        {path: 'myprescreptions', component: Myprescriptions},
        {path: 'myreservations', component: MyReservations},
        {path: 'book-appointment', component: BookAppointmentComponent},
        {path: 'settings', component: Settings},
        {path: 'hospital/:id', component: Hospitaldashboard},
        {path: 'patient/hospital/:id/departments/:deptName', component: Departmentview},
        {path: 'patient/hospital/:id/departments', component: Hospitaldepartments},
        {path: 'doctorprofile', component: Doctorprofile},
        {path: 'reservationconfirmation', component: ReservationConfirmComponent},
        {path: 'er', component: Er},
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  ]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
