import { Component } from '@angular/core';

@Component({
  selector: 'app-reservation-confirm',
  imports:[],
  templateUrl: './reservationconfirmation.html',
  styleUrls: ['./reservationconfirmation.css']
})
export class ReservationConfirmComponent {

  reservation = {
    date: "2023-10-26",
    time: "14:30 PM",
    doctor: "Dr. Emily Carter, Cardiology",
    hospital: "Oak Valley General Hospital, 123 Health St., Wellsville"
  };

  addToCalendar() {
    alert("Calendar event added!");
  }

  viewReservations() {
    // navigate or open route
    alert("Navigating to My Reservations...");
  }
}
