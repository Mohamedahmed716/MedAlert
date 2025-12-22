import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Bed {
  id: number;
  bedNumber: string;
  hospitalId: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
  patientName?: string;
  patientId?: string;
  assignedDoctor?: string;
  notes?: string;
}

export interface BedStats {
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  maintenanceBeds: number;
  reservedBeds: number;
  occupancyRate: number;
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

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/doctor';

  //Mock Data
  private userSource = new BehaviorSubject<any>({
    name: 'Dr. Emily Carter',
    role: 'Cardiologist',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwqIGtOWOnFrJqp3CqvZpNT4UXoiw80UoCEOOZwIX9a7H0L0Vsaq9tQ8bil-yUTzfk_CoSDDdYXz6woongwO9D94QiKnugVhjtlBdzq8FhvdK5H19Gm5QeoknrgGIMU0PZ0_xeJnpk-2mFYHL69y-shVOm2f8q3DV7mi4OeGnK-dRXdPiB-2ZHzGFk5E1n-FcxlecFuJvBXMg9_v1CjgsoaoyaXShetVeqDMfGBRrou_kJ0-PnYHnziO1yyUs-cYHSBzdfvjgVz_k',
    email: 'emily.carter@medalert.com',
    phone: '+1 (555) 123-4567',
    address: '123 Heartbeat Lane, Healthy City, HC 12345'
  });

  currentUser$ = this.userSource.asObservable();

  constructor() { }

  // Bed viewing methods (read-only for doctors)
  getAllBeds(): Observable<Bed[]> {
    const timestamp = new Date().getTime();
    return this.http.get<Bed[]>(`${this.apiUrl}/beds?_t=${timestamp}`);
  }

  getBedStats(): Observable<BedStats> {
    return this.http.get<BedStats>(`${this.apiUrl}/beds/stats`);
  }

  // Reservation methods for doctors
  getMyReservations(): Observable<ReservationResponse[]> {
    return this.http.get<ReservationResponse[]>(`${this.apiUrl}/reservations`);
  }

  getUpcomingReservations(): Observable<ReservationResponse[]> {
    return this.http.get<ReservationResponse[]>(`${this.apiUrl}/reservations/upcoming`);
  }
}
