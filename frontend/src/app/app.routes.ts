import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'doctors',
    loadChildren: () => import('./features/doctors/doctors.module')
      .then(m => m.DoctorsModule)
  },
];
