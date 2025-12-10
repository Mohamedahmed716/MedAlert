import { Routes } from '@angular/router';
import { SystemAdminDashboardComponent } from './dashboard/dashboard.component';
import { ManageHospitalComponent } from './hospitals/add-hospital.component';
import { SettingsComponent } from './settings/settings.component';
import { UserListComponent } from './user-mangment/user-mangment.component';
import { AddUserComponent } from './add-user/add-user.component';

export const ADMIN_ROUTES: Routes = [
  // Dashboard
  { path: '', component: SystemAdminDashboardComponent },
  { path: 'dashboard', component: SystemAdminDashboardComponent },

  // Hospitals
  { path: 'hospitals/new', component: ManageHospitalComponent },
  { path: 'hospitals/edit/:id', component: ManageHospitalComponent },
  { path: 'hospitals', redirectTo: 'dashboard', pathMatch: 'full' },

  // Users
  { path: 'users', component: UserListComponent },
  { path: 'users/new', component: AddUserComponent },
  { path: 'users/edit/:id', component: AddUserComponent },

  // Settings
  { path: 'settings', component: SettingsComponent },

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
