import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  settings = {
    appName: 'MedAlert',
    language: 'English (US)',
    timeZone: '(GMT-08:00) Pacific Time (US & Canada)',
    notificationsEnabled: true,
  };

  showNotification = false;

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/SignIn']);
  }

  saveSettings() {
    console.log('Saving settings:', this.settings);

    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 2000);
  }

  cancel() {
    this.router.navigate(['/admin/dashboard']);
  }
}
