import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
// dashboard.ts
export class DashboardComponent implements OnInit {
  stats = {
    upcomingAppointments: 0,
    activePrescriptions: 0,
    healthStatus: 'Loading...'
  };

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.patientService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.upcomingAppointments = data.upcomingAppointments;
        this.stats.activePrescriptions = data.activePrescriptions;
        this.stats.healthStatus = data.healthStatus;
      },
      error: (err) => console.error('Error fetching stats', err)
    });
  }
}