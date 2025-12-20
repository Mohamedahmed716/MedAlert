import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Doctor {
  id: number;
  fullName: string;
  email: string;
  specialty: string;
  department: string;
  phoneNumber: string;
  profilePhotoUrl?: string;
  bio?: string; // Added bio property
  active: boolean; // Changed from isActive to active
}

export interface CreateDoctorRequest {
  fullName: string;
  email: string;
  password: string;
  specialty: string;
  department: string;
  phoneNumber: string;
  address?: string;
  bio?: string;
  dateOfBirth: string;
  gender: string;
  availability?: AvailabilityItem[];
}

export interface AvailabilityItem {
  day: string;
  checked: boolean;
  startTime: string;
  endTime: string;
}

export interface DashboardStats {
  totalPatients: number;
  activeDoctors: number;
  availableBeds: number;
  upcomingAppointments: number;
  totalReservations: number;
  pendingReservations: number;
}

export interface CreateDepartmentRequest {
  name: string;
  shortCode: string;
  headOfDepartment: string;
  phone: string;
  email: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class HospitalAdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/hospital-admin';

  getAllDoctors(): Observable<Doctor[]> {
    // Add cache-busting parameter to ensure fresh data
    const timestamp = new Date().getTime();
    return this.http.get<Doctor[]>(`${this.apiUrl}/doctors?_t=${timestamp}`);
  }

  createDoctor(request: CreateDoctorRequest): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiUrl}/doctors`, request);
  }

  updateDoctor(doctorId: number, request: CreateDoctorRequest): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/doctors/${doctorId}`, request);
  }

  deleteDoctor(doctorId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/doctors/${doctorId}`);
  }

  toggleDoctorStatus(doctorId: number, isActive: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/doctors/${doctorId}/status?isActive=${isActive}`, {});
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

  getDepartments(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/departments`);
  }

  createDepartment(request: CreateDepartmentRequest): Observable<{name: string, message: string}> {
    return this.http.post(`${this.apiUrl}/departments`, request, { 
      responseType: 'text' 
    }).pipe(
      map((response: string) => {
        try {
          // Try to parse as JSON first
          const jsonResponse = JSON.parse(response);
          return jsonResponse;
        } catch (e) {
          // If it's not JSON, treat it as a plain string (department name)
          console.log('Backend returned plain string, converting to JSON format');
          return { 
            name: response.replace(/"/g, ''), // Remove quotes if present
            message: 'Department created successfully' 
          };
        }
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{message: string}> {
    const request = {
      currentPassword: currentPassword,
      newPassword: newPassword
    };
    return this.http.patch<{message: string}>(`${this.apiUrl}/me/password`, request);
  }
}