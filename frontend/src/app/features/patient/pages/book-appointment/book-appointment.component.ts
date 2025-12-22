import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { ToastService } from '../../../../shared/services/toast.service';

export interface Hospital {
  hospitalId: string;
  name: string;
  address?: string;
}

export interface Doctor {
  id: number;
  fullName: string;
  department: string;
  email: string;
  isActive: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {
  private patientService = inject(PatientService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  // Step tracking
  currentStep = 1;
  totalSteps = 4;

  // Data
  hospitals: Hospital[] = [];
  doctors: Doctor[] = [];
  timeSlots: TimeSlot[] = [];

  // Form data
  selectedHospital: Hospital | null = null;
  selectedDoctor: Doctor | null = null;
  selectedDate: string = '';
  selectedTime: string = '';
  reason: string = '';

  // Loading states
  loadingHospitals = false;
  loadingDoctors = false;
  submitting = false;

  ngOnInit() {
    this.loadHospitals();
    this.generateTimeSlots();
  }

  loadHospitals() {
    this.loadingHospitals = true;
    this.patientService.getHospitals().subscribe({
      next: (hospitals) => {
        this.hospitals = hospitals;
        this.loadingHospitals = false;
      },
      error: (error) => {
        console.error('Error loading hospitals:', error);
        this.toastService.error('Error', 'Failed to load hospitals');
        this.loadingHospitals = false;
      }
    });
  }

  onHospitalSelect(hospital: Hospital) {
    this.selectedHospital = hospital;
    this.selectedDoctor = null;
    this.doctors = [];
    this.loadDoctors(hospital.hospitalId);
    this.nextStep();
  }

  loadDoctors(hospitalId: string) {
    this.loadingDoctors = true;
    this.patientService.getDoctorsByHospital(hospitalId).subscribe({
      next: (doctors) => {
        this.doctors = doctors.filter(d => d.isActive); // Only show active doctors
        this.loadingDoctors = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.toastService.error('Error', 'Failed to load doctors');
        this.loadingDoctors = false;
      }
    });
  }

  onDoctorSelect(doctor: Doctor) {
    this.selectedDoctor = doctor;
    this.nextStep();
  }

  generateTimeSlots() {
    const slots = [];
    // Generate time slots from 9 AM to 5 PM
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = this.formatTime(time);
        slots.push({
          time: displayTime,
          available: Math.random() > 0.3 // Randomly make some slots unavailable
        });
      }
    }
    this.timeSlots = slots;
  }

  formatTime(time: string): string {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  }

  onDateTimeSelect(date: string, time: string) {
    this.selectedDate = date;
    this.selectedTime = time;
    this.nextStep();
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1: return !!this.selectedHospital;
      case 2: return !!this.selectedDoctor;
      case 3: return !!this.selectedDate && !!this.selectedTime;
      case 4: return !!this.reason.trim();
      default: return false;
    }
  }

  submitReservation() {
    if (!this.selectedDoctor || !this.selectedDate || !this.selectedTime || !this.reason.trim()) {
      this.toastService.error('Error', 'Please fill in all required fields');
      return;
    }

    this.submitting = true;

    // Combine date and time into ISO format
    const appointmentDateTime = `${this.selectedDate}T${this.convertTo24Hour(this.selectedTime)}:00`;

    const reservationData = {
      doctorId: this.selectedDoctor.id,
      appointmentTime: appointmentDateTime,
      reason: this.reason
    };

    this.patientService.bookReservation(reservationData).subscribe({
      next: (response) => {
        this.toastService.success('Success', 'Appointment booked successfully!');
        this.router.navigate(['/patient/myreservations']);
      },
      error: (error) => {
        console.error('Error booking appointment:', error);
        this.toastService.error('Error', 'Failed to book appointment');
        this.submitting = false;
      }
    });
  }

  convertTo24Hour(time12h: string): string {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = (parseInt(hours, 10) + 12).toString();
    }
    return `${hours.padStart(2, '0')}:${minutes}`;
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  getMaxDate(): string {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // Allow booking up to 3 months ahead
    return maxDate.toISOString().split('T')[0];
  }

  resetBooking() {
    this.currentStep = 1;
    this.selectedHospital = null;
    this.selectedDoctor = null;
    this.selectedDate = '';
    this.selectedTime = '';
    this.reason = '';
    this.doctors = [];
  }
}