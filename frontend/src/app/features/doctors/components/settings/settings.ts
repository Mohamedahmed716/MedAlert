import {Component, inject, Input, OnInit} from '@angular/core';
import {DoctorService} from '../../doctor.service';
import {ToastService} from '../../../../core/services/toast';
import {Toast} from '../../../../shared/components/toast/toast';

@Component({
  selector: 'app-settings',
  imports: [
    Toast
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  user : any = {};

  showNotificationSettings = false;
  showNotificationPassword = false;

  private doctorService = inject(DoctorService);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.doctorService.currentUser$.subscribe(data => {
      this.user = data;
    });
  }

  saveSettings() {
    this.toastService.showSuccess("Success", "Settings saved successfully!");
  }

  savePassword() {
    this.toastService.showError("Error", "Password changed successfully!");
  }

  // toast will be implememnted right with backend calls
}
