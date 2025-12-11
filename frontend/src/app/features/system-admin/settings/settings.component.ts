import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  settings = {
    appName: 'MedAlert',
    language: 'English (US)',
    timeZone: '(GMT-08:00) Pacific Time (US & Canada)',
    notificationsEnabled: true,
  };

  showNotification = false;
  profilePhotoUrl: string = 'assets/default.png';

  languages = ['English (US)', 'Spanish', 'French', 'German'];
  timeZones = [
    '(GMT-08:00) Pacific Time (US & Canada)',
    '(GMT-05:00) Eastern Time (US & Canada)',
    '(GMT+00:00) Greenwich Mean Time',
    '(GMT+01:00) Central European Time',
  ];

  isLangOpen = false;
  isTimeZoneOpen = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private eRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  toggleLang() {
    this.isLangOpen = !this.isLangOpen;
    this.isTimeZoneOpen = false;
  }

  selectLang(lang: string) {
    this.settings.language = lang;
    this.isLangOpen = false;
  }

  toggleTimeZone() {
    this.isTimeZoneOpen = !this.isTimeZoneOpen;
    this.isLangOpen = false;
  }

  selectTimeZone(tz: string) {
    this.settings.timeZone = tz;
    this.isTimeZoneOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isLangOpen = false;
      this.isTimeZoneOpen = false;
    }
  }

  loadCurrentUser() {
    this.userService.getCurrentUserProfile().subscribe({
      next: (user) => {
        if (user.profilePhotoUrl) {
          this.profilePhotoUrl = user.profilePhotoUrl;
        } else {
          const gender = user.gender ? user.gender.toLowerCase() : '';

          if (gender === 'male') {
            this.profilePhotoUrl = 'assets/male.png';
          } else if (gender === 'female') {
            this.profilePhotoUrl = 'assets/female.png';
          } else {
            this.profilePhotoUrl = 'assets/default.png';
          }
        }
      },
      error: (err) => {
        this.profilePhotoUrl = 'assets/default.png';
      },
    });
  }

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
