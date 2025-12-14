import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DatePipe, NgClass} from '@angular/common';
import { ReservationService} from '../../services/reservation-service';
import {MiscService} from '../../services/misc-service';
import {Shift} from '../../../../shared/ui/models/shift';
import {Reservation} from '../../../../shared/ui/models/reservation';
import {ReservationStatus} from '../../../../shared/ui/models/enums';

@Component({
  selector: 'app-reservations',
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css',
  standalone: true
})
export class Reservations implements OnInit {

  private miscService = inject(MiscService);
  private reservationService = inject(ReservationService);
  protected readonly ReservationStatusEnum = ReservationStatus;

  ngOnInit(): void {
    this.loadTodayReservations();
    this.loadAllReservations();
    this.loadShift();
  }
  loadTodayReservations() {
    this.reservationService.getTodayReservations().subscribe({
      next: (data) => {
        this.todayReservations = data;
        for(let res of this.todayReservations){
          res.appointmentTime = this.formatTimeOnly(res.appointmentTime);
        }
        this.res_num = this.todayReservations.length;
      },
      error: (err) => {
        console.error('Failed to load today reservations', err);
      }
    });
  }

  loadAllReservations() {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.allReservations = data;
        for(let res of this.allReservations){
          res.appointmentTime = this.formatResDate(res.appointmentTime);
        }
      },
      error: (err) => {
        console.error('Failed to load all reservations', err);
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

  formatTimeOnly(dateStr: string): string {
    const date = new Date(dateStr);
    return new DatePipe('en-US').transform(date, 'h:mm a') || '';
  }

  currentDate: Date = new Date();
  shift = ["9:00AM" , "5:00PM"]; // Example shift times

  // Sample reservation data
  todayReservations:Reservation[] = [];
  res_num = 0;

  allReservations:Reservation[] = [];

  protected readonly ReservationStatus = ReservationStatus;
}
