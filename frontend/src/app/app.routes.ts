import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'doctors',
    loadChildren: () => import('./features/doctors/doctors.module').then((m) => m.DoctorsModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
