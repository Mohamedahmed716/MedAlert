import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService} from '../../doctor.service';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
  standalone: true
})
export class Topbar {
  showNotifications = false;

  // Sample notifications data (will be replaced with real data later)
  notifications = [
    { message: 'New Appointment', info: 'Sarah Jenkins - 10 min ago', status: 'unread' },
    { message: 'ER Alert', info: 'Critical Patient - 25 min ago', status: 'unread' },
    { message: 'Lab Results', info: 'John Doe - 1 hour ago', status: 'read' },
  ];
  currentDate: Date = new Date();
  user: any = {};

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.doctorService.currentUser$.subscribe(data => {
      this.user = data;
    });
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
