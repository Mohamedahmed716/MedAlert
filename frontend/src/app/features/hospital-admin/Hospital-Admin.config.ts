import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import {HospitalAdminRoutes} from './Hospital-Admin.routes';

export const hospitalAdminConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(HospitalAdminRoutes)
  ]
};
