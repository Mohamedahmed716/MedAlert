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
    // 1. Check if user is logged in
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/SignIn']);
      return false;
    }

    // 2. Get the required role(s) from the route data
    // The route data might not be present on public routes, but this guard is only used on protected ones.
    const expectedRoles = route.data['roles'] as Array<string>;
    const userRole = this.authService.getUserRole();

    // 3. Check if user has the required role
    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    }

    // 4. If unauthorized, redirect them to their OWN dashboard
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
