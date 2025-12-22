import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hospital {
  id: number;
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  website: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class HospitalService {
  private apiUrl = 'http://localhost:8080/api/v1/hospitals'; // Matches backend @RequestMapping

  constructor(private http: HttpClient) {}

  getHospitals(): Observable<Hospital[]> {
    return this.http.get<Hospital[]>(this.apiUrl);
  }
  getHospitalById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  getDoctorsByDepartment(hospitalId: string, department: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${hospitalId}/departments/${department}/doctors`);
  }
  // hospital.service.ts
  getDepartments(hospitalId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${hospitalId}/departments`);
  }
}