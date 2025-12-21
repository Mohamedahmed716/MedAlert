import { Routes } from '@angular/router';
import { Hospital_admin } from './hospital_admin';

import { AddDoctorComponent } from './pages/add-doctor/add-doctor.component';
import { DoctorListComponent } from './pages/doctors/doctors.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DoctorsDepartmentComponent } from './pages/doctors-departments/doctors-departments';
import { ErAlertComponent } from './pages/er-alert/er-alert';
import { BedManagementComponent } from './pages/bed-management/bed-management.component';
import { ErReservationsComponent } from './pages/er-reservations/er-reservations';
import { ReservationsComponent } from './pages/reservations/reservations';
import { HospitalProfileSettingsComponent } from './pages/settings/settings.component';
import { ReservationAcceptedComponent } from './pages/reservation-confirmation/reservation-confirmation';
import { NotificationCenterComponent } from './pages/notification/notification';
import { PendingReservationDetailComponent } from './pages/pending-reservation/pending-reservation';
import { AddDepartmentComponent } from './pages/add-department/add-department';

export const Hospital_adminRoutes: Routes = [
  {
    path: '',
    component: Hospital_admin, // Layout wrapper with sidebar and topbar
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'add-doctor', component: AddDoctorComponent },
      { path: 'edit-doctor/:id', component: AddDoctorComponent }, // Edit doctor route
      { path: 'doctors', component: DoctorListComponent },
      { path: 'doctors/:id', component: AddDoctorComponent }, // Alternative edit route
      { path: 'doctors-departments', component: DoctorsDepartmentComponent },
      { path: 'er-alert', component: ErAlertComponent },
      { path: 'er-beds', component: BedManagementComponent },
      { path: 'er-reservations', component: ErReservationsComponent },
      { path: 'reservations', component: ReservationsComponent },
      { path: 'settings', component: HospitalProfileSettingsComponent },
      { path: 'reservations/accepted', component: ReservationAcceptedComponent },
      { path: 'pending-reservations', component: PendingReservationDetailComponent },
      { path: 'departments/add', component: AddDepartmentComponent, title: 'Add Department' },
      { path: 'notifications', component: NotificationCenterComponent, title: 'Notification Center' },
    ]
  }
];
