import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HospitalAdminService } from '../../services/hospital-admin.service';
import { ToastService } from '../../../../shared/services/toast.service';

export interface ERAlertResponse {
  id: number;
  guestName: string;
  reason: string;
  bedNumber: string;
  waitTimeMinutes: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  requestTime: string;
  expiryTime: string;
  declineReason?: string;
}

export interface ERAlertActionRequest {
  action: 'ACCEPT' | 'DECLINE';
  declineReason?: string;
}

@Component({
  selector: 'app-er-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './er-alerts.component.html',
  styleUrls: ['./er-alerts.component.css']
})
export class ERAlertComponent implements OnInit {
  private hospitalAdminService = inject(HospitalAdminService);
  private toastService = inject(ToastService);

  alerts: ERAlertResponse[] = [];
  filteredAlerts: ERAlertResponse[] = [];
  loading = false;
  
  // Filters
  statusFilter: string = 'PENDING';
  searchTerm: string = '';
  
  // Modal for decline reason
  showDeclineModal = false;
  selectedAlert: ERAlertResponse | null = null;
  declineReason = '';

  ngOnInit() {
    this.loadAlerts();
    // Auto-refresh every 30 seconds for real-time updates
    setInterval(() => this.loadAlerts(), 30000);
  }

  loadAlerts() {
    this.loading = true;
    this.hospitalAdminService.getAllERAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading ER alerts:', error);
        this.toastService.error('Error', 'Failed to load ER alerts');
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.alerts];

    // Status filter
    if (this.statusFilter !== 'ALL') {
      filtered = filtered.filter(a => a.status === this.statusFilter);
    }

    // Search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.guestName.toLowerCase().includes(term) ||
        a.reason.toLowerCase().includes(term) ||
        a.bedNumber.toLowerCase().includes(term)
      );
    }

    this.filteredAlerts = filtered;
  }

  onFilterChange() {
    this.applyFilters();
  }

  acceptAlert(alert: ERAlertResponse) {
    this.toastService.confirm(
      'Accept ER Request',
      `Accept emergency bed request for ${alert.guestName}?
      
Bed: ${alert.bedNumber}
Reason: ${alert.reason}
Wait Time: ${alert.waitTimeMinutes} minutes`,
      () => {
        this.processAlert(alert.id, { action: 'ACCEPT' });
      }
    );
  }

  declineAlert(alert: ERAlertResponse) {
    this.selectedAlert = alert;
    this.declineReason = '';
    this.showDeclineModal = true;
  }

  confirmDecline() {
    if (!this.selectedAlert) return;
    
    if (!this.declineReason.trim()) {
      this.toastService.error('Error', 'Please provide a reason for declining');
      return;
    }

    this.processAlert(this.selectedAlert.id, {
      action: 'DECLINE',
      declineReason: this.declineReason
    });

    this.closeDeclineModal();
  }

  closeDeclineModal() {
    this.showDeclineModal = false;
    this.selectedAlert = null;
    this.declineReason = '';
  }

  private processAlert(alertId: number, request: ERAlertActionRequest) {
    this.hospitalAdminService.processERAlert(alertId, request).subscribe({
      next: (updatedAlert) => {
        // Update the alert in the list
        const index = this.alerts.findIndex(a => a.id === alertId);
        if (index !== -1) {
          this.alerts[index] = updatedAlert;
          this.applyFilters();
        }

        const action = request.action === 'ACCEPT' ? 'accepted' : 'declined';
        this.toastService.success('Success', `ER request ${action} successfully`);
      },
      error: (error) => {
        console.error('Error processing ER alert:', error);
        this.toastService.error('Error', 'Failed to process ER request');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'ACCEPTED': return 'status-accepted';
      case 'DECLINED': return 'status-declined';
      case 'EXPIRED': return 'status-expired';
      default: return 'status-unknown';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'ACCEPTED': return '✅';
      case 'DECLINED': return '❌';
      case 'EXPIRED': return '⏰';
      default: return '❓';
    }
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString();
  }

  formatTime(dateTime: string): string {
    return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getTimeRemaining(expiryTime: string): string {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s`;
  }

  isExpiringSoon(expiryTime: string): boolean {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry.getTime() - now.getTime();
    
    return diff > 0 && diff <= 5 * 60 * 1000; // 5 minutes or less
  }

  trackByAlertId(index: number, alert: ERAlertResponse): number {
    return alert.id;
  }

  get pendingAlertsCount(): number {
    return this.alerts.filter(a => a.status === 'PENDING').length;
  }
}