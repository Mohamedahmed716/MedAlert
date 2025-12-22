// prescription.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescription } from '../../../shared/ui/models/prescription';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private apiUrl = 'http://localhost:8080/api/v1/patient/prescriptions'; 

  constructor(private http: HttpClient) {}

  getMyPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(this.apiUrl);
  }
}