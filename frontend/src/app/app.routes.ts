import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'hospital-admin',
    loadChildren: () =>
      import('./features/hospital-admin/hospital_admin.routes').then((m) => m.Hospital_adminRoutes),
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
    loadChildren: () => import('./features/patient/patient-module').then((m) => m.PatientModule),
  },
  {
    path: '',
    redirectTo: 'auth/SignIn',
    pathMatch: 'full',
  },
  {
    path: 'patient',
    loadChildren: () => import('./features/patient/patient-module').then((m) => m.PatientModule),
  },
];
