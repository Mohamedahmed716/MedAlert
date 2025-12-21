import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HospitalAdminService, Bed, BedStats, UpdateBedRequest } from '../../services/hospital-admin.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-bed-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bed-management.component.html',
  styleUrls: ['./bed-management.component.css']
})
export class BedManagementComponent implements OnInit {
  private hospitalAdminService = inject(HospitalAdminService);
  private toastService = inject(ToastService);

  beds: Bed[] = [];
  bedStats: BedStats | null = null;
  loading = false;
  error = '';
  success = '';

  // Bed initialization
  showInitializeForm = false;
  numberOfBeds = 20;
  showAddBedsForm = false;
  additionalBeds = 5;
  showRemoveBedsForm = false;
  bedsToRemove = 1;

  // Bed editing
  selectedBed: Bed | null = null;
  showEditModal = false;
  editForm = {
    status: 'AVAILABLE',
    patientName: '',
    patientId: '',
    assignedDoctor: '',
    notes: ''
  };

  ngOnInit() {
    this.loadBeds();
    this.loadBedStats();
  }

  loadBeds() {
    this.loading = true;
    this.hospitalAdminService.getAllBeds().subscribe({
      next: (beds) => {
        this.beds = beds;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading beds:', error);
        this.toastService.error('Error', 'Failed to load beds');
        this.loading = false;
      }
    });
  }

  loadBedStats() {
    this.hospitalAdminService.getBedStats().subscribe({
      next: (stats) => {
        this.bedStats = stats;
      },
      error: (error) => {
        console.error('Error loading bed stats:', error);
      }
    });
  }

  initializeBeds() {
    if (this.numberOfBeds < 1 || this.numberOfBeds > 200) {
      this.toastService.error('Invalid Input', 'Number of beds must be between 1 and 200');
      return;
    }

    this.loading = true;
    this.hospitalAdminService.initializeBeds(this.numberOfBeds).subscribe({
      next: (response) => {
        this.toastService.success('Success', response.message);
        this.showInitializeForm = false;
        this.loadBeds();
        this.loadBedStats();
      },
      error: (error) => {
        console.error('Error initializing beds:', error);
        this.toastService.error('Error', error.error?.message || 'Failed to initialize beds');
        this.loading = false;
      }
    });
  }

  addMoreBeds() {
    if (this.additionalBeds < 1 || this.additionalBeds > 50) {
      this.toastService.error('Invalid Input', 'Additional beds must be between 1 and 50');
      return;
    }

    this.loading = true;
    this.hospitalAdminService.addBeds(this.additionalBeds).subscribe({
      next: (response) => {
        this.toastService.success('Success', response.message);
        this.showAddBedsForm = false;
        this.loadBeds();
        this.loadBedStats();
      },
      error: (error) => {
        console.error('Error adding beds:', error);
        this.toastService.error('Error', error.error?.message || 'Failed to add beds');
        this.loading = false;
      }
    });
  }

  removeBeds() {
    if (this.bedsToRemove < 1 || this.bedsToRemove > this.beds.length) {
      this.toastService.error('Invalid Input', `Number of beds to remove must be between 1 and ${this.beds.length}`);
      return;
    }

    this.loading = true;
    this.hospitalAdminService.removeBeds(this.bedsToRemove).subscribe({
      next: (response) => {
        this.toastService.success('Success', response.message);
        this.showRemoveBedsForm = false;
        this.loadBeds();
        this.loadBedStats();
      },
      error: (error) => {
        console.error('Error removing beds:', error);
        this.toastService.error('Error', error.error?.message || 'Failed to remove beds');
        this.loading = false;
      }
    });
  }

  openEditModal(bed: Bed) {
    this.selectedBed = bed;
    this.editForm = {
      status: bed.status,
      patientName: bed.patientName || '',
      patientId: bed.patientId || '',
      assignedDoctor: bed.assignedDoctor || '',
      notes: bed.notes || ''
    };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.selectedBed = null;
    this.showEditModal = false;
    this.editForm = {
      status: 'AVAILABLE',
      patientName: '',
      patientId: '',
      assignedDoctor: '',
      notes: ''
    };
  }

  updateBed() {
    if (!this.selectedBed) return;

    const request: UpdateBedRequest = {
      status: this.editForm.status,
      patientName: this.editForm.patientName || undefined,
      patientId: this.editForm.patientId || undefined,
      assignedDoctor: this.editForm.assignedDoctor || undefined,
      notes: this.editForm.notes || undefined
    };

    this.hospitalAdminService.updateBedStatus(this.selectedBed.bedNumber, request).subscribe({
      next: (updatedBed) => {
        this.toastService.success('Success', `Bed ${updatedBed.bedNumber} updated successfully`);
        this.closeEditModal();
        this.loadBeds();
        this.loadBedStats();
      },
      error: (error) => {
        console.error('Error updating bed:', error);
        this.toastService.error('Error', 'Failed to update bed');
      }
    });
  }

  quickToggleBed(bed: Bed) {
    const newStatus = bed.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
    const request: UpdateBedRequest = {
      status: newStatus
    };

    this.hospitalAdminService.updateBedStatus(bed.bedNumber, request).subscribe({
      next: () => {
        this.loadBeds();
        this.loadBedStats();
      },
      error: (error) => {
        console.error('Error toggling bed:', error);
        this.toastService.error('Error', 'Failed to update bed status');
      }
    });
  }

  getBedStatusClass(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'bed-available';
      case 'OCCUPIED': return 'bed-occupied';
      case 'MAINTENANCE': return 'bed-maintenance';
      case 'RESERVED': return 'bed-reserved';
      default: return 'bed-unknown';
    }
  }

  getBedStatusIcon(status: string): string {
    switch (status) {
      case 'AVAILABLE': return '🛏️';
      case 'OCCUPIED': return '🏥';
      case 'MAINTENANCE': return '🔧';
      case 'RESERVED': return '📋';
      default: return '❓';
    }
  }

  private clearMessages() {
    setTimeout(() => {
      this.error = '';
      this.success = '';
    }, 5000);
  }
}