import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    upcomingAppointments: 0,
    activePrescriptions: 0,
    activeTreatments: 1
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // You can create a DashboardService to fetch these stats from your backend
    this.loadStats();
  }

  loadStats() {
    // Fetch summary stats logic here
    this.stats.upcomingAppointments = 2; // Sample data
    this.stats.activePrescriptions = 5;
  }
}