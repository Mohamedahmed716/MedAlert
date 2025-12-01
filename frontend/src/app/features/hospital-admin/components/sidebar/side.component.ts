import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { label: 'Dashboard',              icon: 'dashboard',           route: '/hospital-admin/dashboard' },
    { label: 'Doctors',              icon: 'group',           route: '/hospital-admin/doctors' },
    { label: 'Doctors & Departments',icon: 'local_hospital',  route: '/hospital-admin/doctors-departments' },
    { label: 'Reservations',         icon: 'book_online',     route: '/hospital-admin/reservations' },
    { label: 'ER Bed Management',    icon: 'hotel',           route: '/hospital-admin/er-beds' },
    { label: 'ER Alert',             icon: 'emergency',       route: '/hospital-admin/er-alert' },
    { label: 'Settings',             icon: 'settings',        route: '/hospital-admin/settings' },
  ];

  constructor(private router: Router) {}

  // Logout with confirmation
  logout() {

      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/auth/SignIn']);
  }
}
