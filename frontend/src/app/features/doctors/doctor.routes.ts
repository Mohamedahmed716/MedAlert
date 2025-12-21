import { Routes } from '@angular/router';
import { Doctors } from './doctors';
import { Dashboard } from './components/dashboard/dashboard';
import { Prescriptions } from './components/prescriptions/prescriptions';
import { Patients } from './components/patients/patients';
import { Reservations } from './components/reservations/reservations';
import { Er } from './components/er/er';
import { Settings } from './components/settings/settings';
import { BedViewComponent } from './pages/bed-view/bed-view.component';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    component: Doctors,
    children: [
      {path: 'dashboard', component: Dashboard},
      {path: 'prescriptions', component: Prescriptions},
      {path: 'patients', component: Patients},
      {path: 'reservations', component: Reservations},
      {path: 'er', component: Er},
      {path: 'beds', component: BedViewComponent},
      {path: 'settings', component: Settings},
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    ]
  }
];
