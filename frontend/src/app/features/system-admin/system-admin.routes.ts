import { Routes } from '@angular/router';
import { SystemAdminDashboardComponent } from './dashboard/dashboard.component';
import { ManageHospitalComponent } from './hospitals/add-hospital.component';
import { SettingsComponent } from './settings/settings.component';
import { UserListComponent } from './user-mangment/user-mangment.component';
import { AddUserComponent } from './add-user/add-user.component';

export const ADMIN_ROUTES: Routes = [
  // 1. Main Dashboard
  {
    path: '',
    component: SystemAdminDashboardComponent,
  },
  {
    path: 'dashboard',
    component: SystemAdminDashboardComponent,
  },

  // 2. Hospital Routes
  {
    path: 'hospitals/new',
    component: ManageHospitalComponent,
  },
  {
    path: 'hospitals',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // 3. User Management Routes
  {
    path: 'users',
    component: UserListComponent,
  },
  {
    path: 'users/new',
    component: AddUserComponent,
  },

  // 4. Settings
  {
    path: 'settings',
    component: SettingsComponent,
  },

  // Default Redirect
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
];
