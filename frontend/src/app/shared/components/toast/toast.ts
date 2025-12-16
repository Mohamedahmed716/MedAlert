import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from  '../../../core/services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts"
           class="notification-banner"
           [ngClass]="toast.type">

        <div class="notification-content">
          <span class="material-symbols-outlined notification-icon">
            {{ toast.type === 'success' ? 'check_circle' : 'error' }}
          </span>

          <div class="notification-text">
            <p class="notification-title">{{ toast.title }}</p>
            <p class="notification-desc">{{ toast.message }}</p>
          </div>

          <button class="close-btn" (click)="remove(toast.id!)">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* 1. Container handles positioning and stacking */
    .toast-container {
      position: fixed;
      top: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 90%;
      max-width: 28rem;
      pointer-events: none; /* Let clicks pass through empty space */
    }

    /* 2. The Banner Card (Your Design) */
    .notification-banner {
      pointer-events: auto; /* Re-enable clicks on the card */
      background-color: #ecfdf5; /* Default Green Bg */
      border: 1px solid #10b981;
      border-radius: 0.75rem;
      padding: 1rem 1.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

      /* Animation */
      animation: slideDown 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    }

    .notification-content {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .notification-text {
      flex: 1;
    }

    .notification-title {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 700;
      color: #064e3b; /* Default Green Title */
    }

    .notification-desc {
      margin: 0.25rem 0 0 0;
      font-size: 0.875rem;
      color: #065f46; /* Default Green Desc */
      line-height: 1.4;
    }

    /* Icon & Button Styling */
    .notification-icon {
      color: #059669;
      font-size: 1.5rem;
      margin-top: 0.1rem;
    }

    .close-btn {
      background: none;
      border: none;
      color: #059669;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
    }

    /* --- VARIATIONS --- */

    /* ERROR STYLE (Red) */
    .notification-banner.error {
      background-color: #fef2f2;
      border-color: #ef4444;
    }
    .notification-banner.error .notification-title { color: #7f1d1d; }
    .notification-banner.error .notification-desc { color: #991b1b; }
    .notification-banner.error .notification-icon,
    .notification-banner.error .close-btn { color: #dc2626; }

    /* ANIMATION */
    @keyframes slideDown {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class Toast implements OnInit {
  toasts: ToastMessage[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  remove(id: number) {
    this.toastService.removeToast(id);
  }
}
