import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Patient} from '../../../shared/ui/models/patient';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/doctor/patients';

  getRecentPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/recent`);
  }

  getPatients(query : string = ''): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/my-patients`, { params: { query: query } });
  }
}
