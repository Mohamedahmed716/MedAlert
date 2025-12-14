import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Shift} from '../../../shared/ui/models/shift';

@Injectable({
  providedIn: 'root'
})
export class MiscService {
  private http = inject(HttpClient);
  // Ensure this matches your backend controller's @RequestMapping
  private apiUrl = 'http://localhost:8080/api/doctor';

  getTodayShift(): Observable<Shift> {
    // The interceptor will attach "Authorization: Bearer <token>"
    return this.http.get<Shift>(`${this.apiUrl}/shift/today`);
  }
}
