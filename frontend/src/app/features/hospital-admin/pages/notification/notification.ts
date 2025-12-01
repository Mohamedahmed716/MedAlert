// src/app/pages/notification-center/notification-center.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/side.component';

interface Notification {
  id: number;
  title: string;
  timeAgo: string;
  type: 'reservation' | 'er' | 'system' | 'inquiry';
}

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule, RouterModule], // Sidebar added here
  templateUrl: './notification.html',
  styleUrls: ['./notification.css']
})
export class NotificationCenterComponent {
  activeTab = 'all';

  notifications: Notification[] = [
    { id: 1, title: 'New Reservation Pending', timeAgo: '5 minutes ago', type: 'reservation' },
    { id: 2, title: 'ER Bed 3 Now Available', timeAgo: '15 minutes ago', type: 'er' },
    { id: 3, title: 'System Update v2.5 Scheduled', timeAgo: '2 hours ago', type: 'system' },
    { id: 4, title: 'Patient Inquiry from J. Doe', timeAgo: 'Yesterday', type: 'inquiry' },
    { id: 5, title: 'Reservation Confirmed: A. Williams', timeAgo: '2 days ago', type: 'reservation' },
  ];

  filteredNotifications() {
    if (this.activeTab === 'all') return this.notifications;
    return this.notifications.filter(n => n.type === this.getTabType(this.activeTab));
  }

  getTabType(tab: string): string {
    const map: Record<string, string> = {
      'reservations': 'reservation',
      'er-status': 'er',
      'system-updates': 'system',
      'inquiry': 'inquiry'
    };
    return map[tab] || 'reservation';
  }

  getNotificationColor(type: string): string {
    const colors = {
      reservation: 'rgba(17, 147, 212, 0.1)',
      er: 'rgba(239, 68, 68, 0.1)',
      system: 'rgba(234, 179, 8, 0.1)',
      inquiry: 'rgba(34, 197, 94, 0.1)'
    };
    return colors[type as keyof typeof colors] || 'rgba(17, 147, 212, 0.1)';
  }
}
