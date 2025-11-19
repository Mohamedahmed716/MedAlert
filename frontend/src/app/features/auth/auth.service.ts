import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- INLINED DATA MODELS ---

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  role: string;
  hospitalId?: string | null;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
}

// ---------------------------

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/v1/auth';

  // Uses the inlined LoginRequest and AuthResponse interfaces
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  // Uses the inlined RegisterRequest interface
  register(request: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, request);
  }

  saveToken(token: string): void {
    localStorage.setItem('medalert_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('medalert_token');
  }

  logout(): void {
    localStorage.removeItem('medalert_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
