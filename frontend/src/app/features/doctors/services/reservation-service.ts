import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Reservation} from '../../../shared/ui/models/reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/doctor/reservations';

  getRecentReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/recent`);
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getTodayReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/today`);
  }

  getAllReservations(query: string = ''): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/all`, { params: { query: query } });
  }
}
