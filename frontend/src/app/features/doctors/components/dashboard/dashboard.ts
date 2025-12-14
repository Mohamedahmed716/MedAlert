import {Component, Injectable, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MiscService} from '../../services/misc-service';
import{ inject } from '@angular/core';
import{Shift} from '../../../../shared/ui/models/shift';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true
})
export class Dashboard implements OnInit {

  private miscService = inject(MiscService);

    ngOnInit(): void {
      this.loadShift();
    }

  loadShift() {
    this.miscService.getTodayShift().subscribe({
      next: (data: Shift) => {
        if (data) {
          // Backend returned a shift
          this.shift = [
            this.formatTime(data.startTime),
            this.formatTime(data.endTime)
          ];
        } else {
          // Backend returned 204 No Content (null)
          this.shift = ["Off", "Duty"];
        }
      },
      error: (err) => {
        console.error('Failed to load shift', err);
        this.shift = ["--:--", "--:--"]; // Error state
      }
    });
  }
  private formatTime(timeStr: string): string {
    if (!timeStr) return '';

    // Split "09:00:00"
    const [hourStr, minStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';

    // Convert 24h to 12h format
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'

    return `${hour}:${minStr} ${ampm}`;
  }

    reservations = [
        {name: 'John Doe', time: '10:00 AM', condition: 'Flu' },
        {name: 'Jane Smith', time: '11:00 AM', condition: 'Flu' },
        {name: 'Alice Johnson', time: '09:30 AM', condition: 'Flu' },
    ];
    pending_res = 2; // Example pending reservations count

    currentDate = new Date();
    shift = ["9:00 AM", "5:00 PM"];
    er_occ = 75; // Example occupancy percentage
    crit_cases = 5; // Example critical cases count

    patients = [
        {name: 'Michael Brown', room: "302", condition: 'Diabetes' },
        {name: 'Emily Davis', room: "305", condition: 'Hypertension' },
        {name: 'Daniel Wilson', room: "308", condition: 'Arthritis' },
    ];

    pending_patients = 12; // Example pending patients count

    prescriptions = [
        {name: 'Olivia Martinez', medication: "Atorvastatin", dosage: '10mg', date: '2024-06-15' },
        {name: 'Liam Garcia', medication: "Lisinopril", dosage: '20mg', date: '2024-06-15' },
        {name: 'Sophia Rodriguez', medication: "Metformin", dosage: '500mg', date: '2024-06-15' },
    ];
}
