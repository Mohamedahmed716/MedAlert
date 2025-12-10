import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hospital, HospitalStats } from '../../shared/ui/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/hospitals';

  getHospitals(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(this.apiUrl);
  }

  getHospitalById(id: string): Observable<Hospital> {
    return this.http.get<Hospital>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<HospitalStats> {
    return this.http.get<HospitalStats>(`${this.apiUrl}/stats`);
  }

  createHospital(data: any): Observable<Hospital> {
    return this.http.post<Hospital>(this.apiUrl, data);
  }

  updateHospital(id: string, data: any): Observable<Hospital> {
    return this.http.put<Hospital>(`${this.apiUrl}/${id}`, data);
  }

  toggleStatus(id: string, status: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteHospital(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
