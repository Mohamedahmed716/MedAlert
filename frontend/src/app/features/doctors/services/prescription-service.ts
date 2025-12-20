import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescription } from '../../../shared/ui/models/prescription';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/doctor/prescriptions';

  loadRecentPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/recent`);
  }

  loadPrescriptions(query : string = ''): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/load`, { params: { query: query } });
  }

  createPrescription(prescription: Partial<Prescription>): Observable<Prescription> {
    return this.http.post<Prescription>(`${this.apiUrl}/create`, prescription);
  }

  getPrescriptions(patientId: number): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/patient/${patientId}`);
  }
}
