import { Component, OnInit } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';

interface Reservation {
  id: string;
  date: string; 
  time: string;
  doctor: string;
  department: string;
  location: string;
  online?: boolean;
}

interface Prescription {
  id: string;
  name: string;
  remainingDays: number;
  dosage?: string;
  expiresOn?: string; 
}

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [ DatePipe,CommonModule]
})
export class Dashboard implements OnInit {
  userName = 'Abdelrhman';
  greeting = '';
  personalizedMessage = '';

  reservations: Reservation[] = [];
  prescriptions: Prescription[] = [];
  notificationsCount = 2;

  constructor() {}

  ngOnInit(): void {
    this.setGreeting();
    this.loadSampleData();
    this.personalizedMessage = `Here are your upcoming reservations and prescriptions — tap an action to proceed.`;
  }

  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good morning';
    else if (hour < 18) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';
  }

  loadSampleData() {
    // Sample upcoming reservations
    this.reservations = [
      {
        id: 'r1',
        date: this.addDaysISO(1),
        time: '15:00',
        doctor: 'Dr. Sarah El-Gamal',
        department: 'Cardiology',
        location: 'City General Hospital - Room 403',
        online: false
      },
      {
        id: 'r2',
        date: this.addDaysISO(5),
        time: '09:30',
        doctor: 'Dr. Omar Nabil',
        department: 'Dermatology',
        location: 'Oak Valley Medical Center - Clinic 12',
        online: true
      },
      {
        id: 'r3',
        date: this.addDaysISO(12),
        time: '11:00',
        doctor: 'Dr. Lina Farouk',
        department: 'Pediatrics',
        location: 'Sunrise Children\'s Hospital - Pediatrics Wing',
        online: false
      }
    ];

    // Sample prescriptions
    this.prescriptions = [
      { id: 'p1', name: 'Atorvastatin 20mg', remainingDays: 5, dosage: '1 tab/day', expiresOn: this.addDaysISO(5) },
      { id: 'p2', name: 'Lisinopril 10mg', remainingDays: 25, dosage: '1 tab/day', expiresOn: this.addDaysISO(25) },
      { id: 'p3', name: 'Salbutamol Inhaler', remainingDays: 2, dosage: '2 puffs as needed', expiresOn: this.addDaysISO(2) }
    ];
  }

  addDaysISO(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }

  // Actions
  bookAppointment() {
    // route to booking page or open modal in your app
    console.log('Book appointment clicked');
    alert('Book Appointment — wire this to your booking flow.');
  }

  requestRefill(prescriptionId?: string) {
    if (prescriptionId) {
      console.log('Request refill for', prescriptionId);
      alert(`Requested refill for prescription ${prescriptionId}.`);
    } else {
      console.log('Request refill (general)');
      alert('Requested refill for all applicable prescriptions.');
    }
  }

  renewPrescription(p: Prescription) {
    console.log('Renewing', p.id);
    // placeholder: call API then update UI
    alert(`Renew request sent for ${p.name}.`);
  }

  joinOnlineVisit(resId: string) {
    console.log('Join online visit', resId);
    alert(`Joining online visit for reservation ${resId}...`);
  }

  rescheduleReservation(resId: string) {
    console.log('Reschedule', resId);
    alert(`Open reschedule flow for ${resId}.`);
  }

  contactSupport() {
    console.log('Contact support');
    alert('Opening chat with support...');
  }

  uploadDocument() {
    console.log('Upload document');
    alert('Open upload dialog (implement file picker).');
  }

  // Helpers
  isExpiringSoon(p: Prescription) {
    return p.remainingDays <= 7;
  }

  trackByReservation(_: number, r: Reservation) {
    return r.id;
  }

  trackByPrescription(_: number, p: Prescription) {
    return p.id;
  }
}
