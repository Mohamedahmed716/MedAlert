import { Routes } from '@angular/router';
import {HospitalAdminRoutes} from './features/hospital-admin/Hospital-Admin.routes';

export const routes: Routes = [
  {
    path: 'hospital-admin',
    loadChildren: () => import('./features/hospital-admin/Hospital-Admin.routes').then((m) => m.HospitalAdminRoutes),
  },
  {
    path: 'doctors',
    loadChildren: () => import('./features/doctors/doctors.module').then((m) => m.DoctorsModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/system-admin/system-admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'patient',
    loadChildren: () => import('./features/patient/patient-module').then(m => m.PatientModule),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
