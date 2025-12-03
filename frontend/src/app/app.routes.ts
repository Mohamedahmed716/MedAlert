import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'doctors',
    // Legacy module structure
    loadChildren: () => import('./features/doctors/doctors.module').then((m) => m.DoctorsModule),
  },
  {
    path: 'auth',
    // Lazy loads Auth routes (Sign In, Sign Up)
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    // Lazy loads System Admin routes (Hospital Management, Users, etc.)
    loadChildren: () =>
      import('./features/system-admin/system-admin.routes').then((m) => m.ADMIN_ROUTES),
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
