import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import {Hospital_adminRoutes} from './hospital_admin.routes';

export const hospital_adminConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(Hospital_adminRoutes)
  ]
};
