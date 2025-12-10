import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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
  private router = inject(Router);

  private apiUrl = 'http://localhost:8080/api/v1/auth';

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, request);
  }

  saveUserSession(token: string, role: string): void {
    localStorage.setItem('medalert_token', token);
    localStorage.setItem('medalert_role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('medalert_token');
  }

  getUserRole(): string | null {
    return localStorage.getItem('medalert_role');
  }

  logout(): void {
    localStorage.removeItem('medalert_token');
    localStorage.removeItem('medalert_role');
    this.router.navigate(['/auth/SignIn']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
