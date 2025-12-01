import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-reservations',
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css',
})
export class Reservations {
  currentDate: Date = new Date();
  shift = ["9:00AM" , "5:00PM"]; // Example shift times

  // Sample reservation data
  todayReservations = [
    { patient: 'Jane Doe', time: '9:00 AM', condition: 'Check-up', status: 'Confirmed'},
    { patient: 'Bob Smith', time: '10:00 AM', condition: 'Flu', status: 'Cancelled'}
  ];
  res_num = this.todayReservations.length;

  allReservations = [
    { patient: 'John Doe', date: 'Nov 16', time: '9:00 AM', condition: 'Flu', status: 'Confirmed' },
    { patient: 'Jane Smith', date: 'Nov 15', time: '10:00 AM', condition: 'Check-up', status: 'Cancelled' }
  ];

}
