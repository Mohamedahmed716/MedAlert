import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  title: string;       // Added title
  message: string;     // Renamed text -> message for clarity
  type: 'success' | 'error';
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage[]>([]);
  toasts$ = this.toastSubject.asObservable();

  showSuccess(title: string, message: string) {
    this.addToast(title, message, 'success');
  }

  showError(title: string, message: string) {
    this.addToast(title, message, 'error');
  }

  private addToast(title: string, message: string, type: 'success' | 'error') {
    const currentToasts = this.toastSubject.value;
    const newToast: ToastMessage = { title, message, type, id: Date.now() };

    // Add to list
    this.toastSubject.next([...currentToasts, newToast]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      this.removeToast(newToast.id!);
    }, 3000);
  }

  removeToast(id: number) {
    const currentToasts = this.toastSubject.value;
    this.toastSubject.next(currentToasts.filter(t => t.id !== id));
  }
}
