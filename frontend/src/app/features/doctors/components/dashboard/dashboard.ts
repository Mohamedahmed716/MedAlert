import {Component, Injectable, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MiscService} from '../../services/misc-service';
import{ inject } from '@angular/core';
import{Shift} from '../../../../shared/ui/models/shift';
import{PatientService} from '../../services/patient-service';
import {Patient} from '../../../../shared/ui/models/patient';
import {ReservationService} from '../../services/reservation-service';
import {Reservation} from '../../../../shared/ui/models/reservation';
import {PrescriptionService} from '../../services/prescription-service';
import {Prescription} from '../../../../shared/ui/models/prescription';

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
  private patientService = inject(PatientService);
  private reservationService = inject(ReservationService);
  private prescriptionService = inject(PrescriptionService);

  reservations : Reservation[] = [];
  pending_res = 2;

  currentDate = new Date();
  shift = ["9:00 AM", "5:00 PM"];
  er_occ = 75;
  crit_cases = 5;

  patients : Patient[] = [];

  prescriptions : Prescription[] = [];

  ngOnInit(): void {
    this.loadShift();
    this.loadReservations();
    this.loadReservationCount();
    this.loadPatients();
    this.loadPrescriptions();
  }
  loadReservationCount() {
    this.reservationService.getCount().subscribe({
      next: (count) => {
        this.pending_res = count;
      },
      error: (err) => {
        console.error('Failed to load reservation count', err);
      }
    })
  }
  loadReservations() {
    this.reservationService.getRecentReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        for(let res of this.reservations){
          res.appointmentTime = this.formatResDate(res.appointmentTime);
        }
      },
      error: (err) => {
        console.error('Failed to load recent reservations', err);
      }
    });
  }
  loadPatients() {
    this.patientService.getRecentPatients().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: (err) => {
        console.error('Failed to load recent patients', err);
      }
    });
  }
  loadPrescriptions() {
    this.prescriptionService.loadRecentPrescriptions().subscribe({
      next: (data) => {
        this.prescriptions = data;
      }
      ,error: (err) => {
        console.error('Failed to load recent prescriptions', err);
      }
    });
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

  formatResDate(dateStr: string): string {
    const date = new Date(dateStr);
    return new DatePipe('en-US').transform(date, 'MMM d, y, h:mm a') || '';
  }


}
