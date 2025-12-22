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
  getMyReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.baseUrl}/reservations`);
  }

  // Sends a new reservation request to the backend
  bookReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/reservations`, reservation);
  }

  // Cancels an existing reservation
  cancelReservation(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/reservations/${id}/cancel`, {});
  }
}