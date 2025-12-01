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

  showNotification = false;

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.doctorService.currentUser$.subscribe(data => {
      this.user = data;
    });
  }

  saveSettings() {
    console.log('Saving settings:');

    this.showNotification = true;

    setTimeout(() => {
      this.showNotification = false;
    }, 2000);
  }
}
