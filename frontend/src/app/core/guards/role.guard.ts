import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/SignIn']);
      return false;
    }

    const expectedRoles = route.data['roles'] as Array<string>;
    const userRole = this.authService.getUserRole();

    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    }

    if (userRole === 'SYSTEM_ADMIN') {
      this.router.navigate(['/admin']);
    } else if (userRole === 'HOSPITAL_ADMIN') {
      this.router.navigate(['/hospital-admin']);
    } else if (userRole === 'DOCTOR') {
      this.router.navigate(['/doctors']);
    } else {
      this.router.navigate(['/patient']);
    }

    return false;
  }
}
