import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent {
  showNotifications = false;
  currentDate: Date = new Date();

  user = {
    name: 'Dr. Evelyn Reed',
    role: 'Hospital Admin',
    avatar: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/aur44wgqbL.png'
  };

  // Sample notifications data
  notifications = [
    {  message: 'New Reservation Pending', info: 'Sarah Jenkins-5 minutes ago',status: 'unread' },
    {  message: 'ER Bed 3 Now Available', timeAgo: '15 minutes ago',status: 'unread' },
    {  message: 'System Update v2.5 Scheduled', timeAgo: '2 hours ago' ,status: 'unread'},
    {  message: 'Patient Inquiry from J. Doe', timeAgo: 'Yesterday' ,status: 'read'},
    {  message: 'Reservation Confirmed: A. Williams', timeAgo: '2 days ago',status: 'read' },
  ];

  ngOnInit() {
    setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
