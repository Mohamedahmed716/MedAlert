import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {User} from '../../../shared/ui/models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/doctor/settings';

  getUserData(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/loadData`);
  }

  saveSettings(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/saveSettings`, user);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/changePassword`, { oldPassword, newPassword });
  }
}
