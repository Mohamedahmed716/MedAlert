import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  showConfirm?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  success(title: string, message: string, duration: number = 5000): void {
    this.addToast({
      id: this.generateId(),
      type: 'success',
      title,
      message,
      duration
    });
  }

  error(title: string, message: string, duration: number = 7000): void {
    this.addToast({
      id: this.generateId(),
      type: 'error',
      title,
      message,
      duration
    });
  }

  warning(title: string, message: string, duration: number = 6000): void {
    this.addToast({
      id: this.generateId(),
      type: 'warning',
      title,
      message,
      duration
    });
  }

  info(title: string, message: string, duration: number = 5000): void {
    this.addToast({
      id: this.generateId(),
      type: 'info',
      title,
      message,
      duration
    });
  }

  confirm(
    title: string, 
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel'
  ): void {
    this.addToast({
      id: this.generateId(),
      type: 'warning',
      title,
      message,
      showConfirm: true,
      confirmText,
      cancelText,
      onConfirm,
      onCancel
    });
  }

  private addToast(toast: Toast): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto remove toast after duration (if not a confirmation toast)
    if (toast.duration && !toast.showConfirm) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, toast.duration);
    }
  }

  removeToast(id: string): void {
    const currentToasts = this.toastsSubject.value;
    const updatedToasts = currentToasts.filter(toast => toast.id !== id);
    this.toastsSubject.next(updatedToasts);
  }

  clearAll(): void {
    this.toastsSubject.next([]);
  }
}