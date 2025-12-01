import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-er-status',
  imports:[CommonModule],
  templateUrl: './er.html',
  styleUrls: ['./er.css']
})
export class Er {

  hospitalName = "St. Luke's Medical Center";

  beds = [
    { number: 101, available: true },
    { number: 102, available: false },
    { number: 103, available: false },
    { number: 104, available: true },
    { number: 105, available: true },

    { number: 106, available: false },
    { number: 107, available: true },
    { number: 108, available: false },
    { number: 109, available: false },
    { number: 110, available: true },

    { number: 111, available: false },
    { number: 112, available: true }
  ];

  requestBed() {
    alert("ER Bed Request Submitted!");
  }
}
