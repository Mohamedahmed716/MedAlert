import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ToastService } from '../../../../core/services/toast';
import { Toast } from '../../../../shared/components/toast/toast';
import { Prescription } from '../../../../shared/ui/models/prescription';
import { PrescriptionService } from '../../services/prescription-service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DurationTime } from '../../../../shared/ui/models/enums';

@Component({
  selector: 'app-prescriptions',
  imports: [Toast, FormsModule, CommonModule],
  templateUrl: './prescriptions.html',
  styleUrl: './prescriptions.css',
  standalone: true
})
export class Prescriptions implements OnInit {
  // --- 1. DATA & PAGINATION ---
  allPrescriptions: Prescription[] = [];       // All matching results from backend
  displayedPrescriptions: Prescription[] = []; // Sliced data for current page (max 4)

  searchtext: string = '';

  // Pagination Settings
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  // --- 2. FORM DATA ---
  newPrescription: any = {
    patientName: '',
    medicationName: '',
    dosage: '',
    frequency: 'Once daily',
    duration: null,
    durationTime: DurationTime.DAYS,
    instructions: ''
  };

  isFormSubmitted = false;

  // --- 3. DROPDOWN DATA ---
  frequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Every 8 hours',
    'Every 12 hours'
  ];

  durationUnits = Object.values(DurationTime);

  isFrequencyOpen = false;
  isDurationUnitOpen = false;

  // --- 4. SERVICES ---
  private prescriptionService = inject(PrescriptionService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchtext = params['search'];
      }
      this.loadPrescriptions();
    });
  }

  // --- 5. DATA LOADING ---
  loadPrescriptions() {
    // Backend handles filtering based on searchtext
    this.prescriptionService.loadPrescriptions(this.searchtext).subscribe({
      next: (data) => {
        this.allPrescriptions = data;
        this.currentPage = 1; // Reset to page 1 on new load
        this.updatePagination();
      },
      error: (error) => console.error('Error loading prescriptions:', error)
    });
  }

  onSearch() {
    // Reload data from backend when user types
    this.loadPrescriptions();
  }

  // Only handles slicing (splitting into pages)
  updatePagination() {
    // 1. Calculate Total Pages
    this.totalPages = Math.ceil(this.allPrescriptions.length / this.itemsPerPage) || 1;

    // 2. Slice Data for current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedPrescriptions = this.allPrescriptions.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // --- 6. FORM ACTIONS ---
  sendPrescription() {
    this.isFormSubmitted = true;

    if (!this.isValid()) {
      this.toast.showError('Error', 'Please fill in all required fields.');
      return;
    }

    this.prescriptionService.createPrescription(this.newPrescription).subscribe({
      next: (response) => {
        this.toast.showSuccess('Success', 'Prescription sent successfully!');
        this.resetForm();
        this.loadPrescriptions(); // Refresh list to show new item
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to send prescription.';
        this.toast.showError('Error', msg);
        console.error(err);
      }
    });
  }

  isValid(): boolean {
    return !!(
      this.newPrescription.patientName &&
      this.newPrescription.medicationName &&
      this.newPrescription.dosage &&
      this.newPrescription.frequency &&
      this.newPrescription.duration &&
      this.newPrescription.durationTime
    );
  }

  resetForm() {
    this.isFormSubmitted = false;
    this.newPrescription = {
      patientName: '',
      medicationName: '',
      dosage: '',
      frequency: 'Once daily',
      duration: null,
      durationTime: DurationTime.DAYS,
      instructions: ''
    };
  }

  // --- 7. DROPDOWN LOGIC ---
  toggleFrequency() {
    this.isFrequencyOpen = !this.isFrequencyOpen;
    this.isDurationUnitOpen = false;
  }

  selectFrequency(val: string) {
    this.newPrescription.frequency = val;
    this.isFrequencyOpen = false;
  }

  toggleDurationUnit() {
    this.isDurationUnitOpen = !this.isDurationUnitOpen;
    this.isFrequencyOpen = false;
  }

  selectDurationUnit(val: any) {
    this.newPrescription.durationTime = val as DurationTime;
    this.isDurationUnitOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeDropdowns(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.custom-select-container')) {
      this.isFrequencyOpen = false;
      this.isDurationUnitOpen = false;
    }
  }
}
