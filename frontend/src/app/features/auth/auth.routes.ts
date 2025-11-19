import { Routes } from '@angular/router';
import { SignInComponent } from './SignIn/SignIn.component';
import { SignUpComponent } from './SignUp/SignUp.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: 'SignIn',
    component: SignInComponent,
  },
  {
    path: 'SignUp',
    component: SignUpComponent,
  },
];
