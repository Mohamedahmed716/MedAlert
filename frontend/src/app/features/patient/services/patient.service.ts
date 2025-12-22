import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Matching your Java DTO structures
export interface Prescription {
  id: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  prescribedDate: string;
  instructions: string;
  patientName: string; // Used for Doctor Name in Patient view
}

export interface Reservation {
  id?: number;
  doctorId?: number;
  patientName?: string; // Used for Doctor Name in Patient view
  reason: string;
  appointmentTime: string;
  status?: string;
}

export interface ReservationResponse {
  id: number;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  doctorDepartment: string;
  appointmentTime: string;
  reason: string;
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED';
  declineReason?: string;
  createdAt: string;
  updatedAt: string;
}

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

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = 'http://localhost:8080/api/v1/patient';

  constructor(private http: HttpClient) { }

  // Fetches prescriptions for "My Prescriptions" screen
  getMyPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.baseUrl}/prescriptions`);
  }

  // Fetches reservations for "My Reservations" screen
  getMyReservations(): Observable<ReservationResponse[]> {
    return this.http.get<ReservationResponse[]>(`${this.baseUrl}/reservations`);
  }

  // Sends a new reservation request to the backend
  bookReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/reservations`, reservation);
  }

  // Cancels an existing reservation
  cancelReservation(id: number): Observable<ReservationResponse> {
    return this.http.patch<ReservationResponse>(`${this.baseUrl}/reservations/${id}/cancel`, {});
  }

  // Get list of hospitals for booking
  getHospitals(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>('http://localhost:8080/api/v1/public/hospitals');
  }

  // Get doctors by hospital for booking
  getDoctorsByHospital(hospitalId: string): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`http://localhost:8080/api/v1/public/hospitals/${hospitalId}/doctors`);
  }
}