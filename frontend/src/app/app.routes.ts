import { Routes } from '@angular/router';
import { RoleGuard } from './core/guards/role.guard';
import { PublicBedView } from './features/er/public.bed.view/public.bed.view';
import { PublicHospitalList } from './features/er/public.hospital.list/public.hospital.list';

export const routes: Routes = [
  {
    path: 'hospital-admin',
    loadChildren: () =>
      import('./features/hospital-admin/hospital_admin.routes').then((m) => m.Hospital_adminRoutes),
    canActivate: [RoleGuard],
    data: { roles: ['HOSPITAL_ADMIN'] },
  },
  {
    path: 'doctors',
    loadChildren: () => import('./features/doctors/doctors.module').then((m) => m.DoctorsModule),
    canActivate: [RoleGuard],
    data: { roles: ['DOCTOR'] },
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/system-admin/system-admin.routes').then((m) => m.ADMIN_ROUTES),
    canActivate: [RoleGuard],
    data: { roles: ['SYSTEM_ADMIN'] },
  },
  {
    path: 'patient',
    loadChildren: () => import('./features/patient/patient-module').then((m) => m.PatientModule),
    canActivate: [RoleGuard],
    data: { roles: ['PATIENT'] },
  },
  { path: 'emergency/hospitals', component: PublicHospitalList },
  { path: 'emergency/hospital/:name', component: PublicBedView },
  {
    path: '',
    redirectTo: 'auth/SignIn',
    pathMatch: 'full',
  },
];
