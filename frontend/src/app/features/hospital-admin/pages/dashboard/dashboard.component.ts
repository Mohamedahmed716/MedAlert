import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
}

interface Activity {
  icon: string;
  iconBg: string;
  title: string;
  highlight: string;
  description: string;
  time: string;
}

interface QuickAction {
  title: string;
  img: string;
  route: string; // ← Add route property
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  pageTitle = 'Hospital Dashboard';

  quickActions: QuickAction[] = [
    {
      title: 'Manage Departments',
      img: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/fpsC2pzvtM.png',
      route: '/hospital-admin/doctors-departments' // ← Add route
    },
    {
      title: 'Manage Doctors',
      img: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/9aFgvO3VB3.png',
      route: '/hospital-admin/doctors' // ← Add route
    },
    {
      title: 'Pending Reservations',
      img: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/nVmHtztyqt.png',
      route: '/hospital-admin/reservations' // ← Add route
    },
    {
      title: 'ER Bed Status',
      img: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/x3oKrwC5ja.png',
      route: '/hospital-admin/er-beds' // ← Add route
    },
  ];

  stats: StatCard[] = [
    { title: 'Total Patients', value: '1,234' },
    { title: 'Active Doctors', value: '87' },
    { title: 'Available Beds', value: '15' },
    { title: 'Upcoming Appointments', value: '42' },
  ];

  chartData = [
    { day: 'Mon', height: 50 },
    { day: 'Tue', height: 20 },
    { day: 'Wed', height: 40 },
    { day: 'Thu', height: 100 },
    { day: 'Fri', height: 80 },
    { day: 'Sat', height: 80 },
    { day: 'Sun', height: 50 },
  ];

  activities: Activity[] = [
    {
      icon: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/UJ5rBwAjGS.png',
      iconBg: '#dcfce7',
      title: 'New department',
      highlight: 'Neurology',
      description: 'created.',
      time: '1 day ago'
    },
    {
      icon: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/vwxPJw9NNQ.png',
      iconBg: '#ffedd5',
      title: 'High-priority reservation for',
      highlight: 'Jane Doe',
      description: '.',
      time: '3 days ago'
    },
    {
      icon: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/391c0W4Ut6.png',
      iconBg: '#fee2e2',
      title: 'ER Bed capacity reached',
      highlight: '95%',
      description: '.',
      time: '5 days ago'
    },
    {
      icon: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/jdszyevyq8.png',
      iconBg: '#dbeafe',
      title: 'New doctor',
      highlight: 'Dr. John Smith',
      description: 'added to Cardiology.',
      time: '2 hours ago'
    },
  ];

  constructor(private router: Router) {} // ← Inject Router

  // ← Add navigation method
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
