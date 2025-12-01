import {Component, Input} from '@angular/core';
import {DoctorService} from '../../doctor.service';


@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  user : any = {};

  showNotificationSettings = false;
  showNotificationPassword = false;

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.doctorService.currentUser$.subscribe(data => {
      this.user = data;
    });
  }

  saveSettings() {
    console.log('Saving settings:');

    this.showNotificationSettings = true;

    setTimeout(() => {
      this.showNotificationSettings = false;
    }, 2000);
  }

  savePassword() {
    this.showNotificationPassword = true;

    setTimeout(() => {
      this.showNotificationPassword = false;
    }, 2000);
  }
}
