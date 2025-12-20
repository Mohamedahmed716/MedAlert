import {Component, inject, Input, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings-service';
import {ToastService} from '../../../../core/services/toast';
import {Toast} from '../../../../shared/components/toast/toast';
import {User} from '../../../../shared/ui/models/auth.models';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [
    Toast,
    FormsModule
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private settingsService = inject(SettingsService);
  private toastService = inject(ToastService);
  user: User | undefined;
  new_user: User = {
    id: 0,
    fullName: '',
    email: '',
    role: 'DOCTOR',
    active: true,
    dateCreated: '',
  };

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.settingsService.getUserData().subscribe({
      next: (data) => {
        this.user = data;
        this.new_user = { ...data };
      },
      error: (err) => {
        console.error('Failed to load user data', err);
      }
    });
  }

  saveSettings() {
    const payload: Partial<User> = {
      fullName: this.new_user.fullName,
      phoneNumber: this.new_user.phoneNumber,
      address: this.new_user.address,
      dateOfBirth: this.new_user.dateOfBirth,
      email: this.new_user.email
    };

    this.settingsService.saveSettings(payload as User).subscribe({
      next: (data) => {
        this.user = data;
        this.new_user = { ...data };
        this.toastService.showSuccess("Success", "Settings saved successfully!");
      }
      ,error: (err) => {
        console.error('Failed to save settings', err);
        this.toastService.showError("Error", err.message || "Failed to save settings.");
      }
    }
    );
  }


  savePassword() {
    this.toastService.showError("Error", "Password changed successfully!");
  }

  resetSettings() {
    if (this.user) {
      this.new_user = { ...this.user };
    }
  }

}
