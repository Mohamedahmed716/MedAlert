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

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.doctorService.currentUser$.subscribe(data => {
      this.user = data;
    });
  }
}
