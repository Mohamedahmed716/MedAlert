import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/side.component';
import { HospitalAdminService, Doctor } from '../../services/hospital-admin.service';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorListComponent implements OnInit {

  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  searchTerm = '';
  selectedDepartment = '';
  selectedStatus: 'Active' | 'Pending' | '' = '';
  isLoading = false;
  showStatusUpdateNotification = false;
  lastRefreshTime: Date | null = null;

  currentPage = 1;
  itemsPerPage = 6; // Looks best with cards
  totalPages = 1;

  departments: string[] = [];

  constructor(
    private hospitalAdminService: HospitalAdminService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDoctors();
    this.loadDepartments();

    // Auto-refresh disabled - use manual refresh button instead
    // setInterval(() => {
    //   this.refreshDoctorsQuietly();
    // }, 15000);
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.hospitalAdminService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.filteredDoctors = [...this.doctors];
        this.updateTotalPages();
        this.isLoading = false;
        this.lastRefreshTime = new Date();
        console.log('📊 Loaded', doctors.length, 'doctors at', this.lastRefreshTime.toLocaleTimeString());
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.isLoading = false;
      }
    });
  }

  // Refresh doctors data without showing loading indicator
  refreshDoctorsQuietly(): void {
    console.log('🔄 Refreshing doctors data...');
    this.hospitalAdminService.getAllDoctors().subscribe({
      next: (doctors) => {
        console.log('📊 Received doctors data:', doctors.length, 'doctors');
        
        // Check if there are any status changes
        const hasChanges = this.doctors.some(oldDoctor => {
          const newDoctor = doctors.find(d => d.id === oldDoctor.id);
          if (newDoctor && newDoctor.active !== oldDoctor.active) {
            console.log(`✅ Status change detected for ${newDoctor.fullName}: ${oldDoctor.active} → ${newDoctor.active}`);
            return true;
          }
          return false;
        });

        // Always update the doctors array to ensure we have the latest data
        this.doctors = doctors;
        this.filterDoctors(); // Re-apply current filters
        this.lastRefreshTime = new Date();

        if (hasChanges) {
          this.showStatusUpdateNotification = true;
          console.log('🎉 Doctor statuses updated from system admin approval');

          // Hide notification after 5 seconds
          setTimeout(() => {
            this.showStatusUpdateNotification = false;
          }, 5000);
        } else {
          console.log('ℹ️ No status changes detected');
        }
      },
      error: (error) => {
        console.error('❌ Error refreshing doctors:', error);
      }
    });
  }

  loadDepartments(): void {
    // Load departments from backend
    this.hospitalAdminService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        // Fallback to extracting from doctors if API fails
        const uniqueDepartments = [...new Set(this.doctors.map(d => d.department))];
        this.departments = uniqueDepartments.sort();
      }
    });
  }

  filterDoctors(): void {
    let filtered = this.doctors;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        d.fullName.toLowerCase().includes(term) ||
        d.department.toLowerCase().includes(term)
      );
    }

    if (this.selectedDepartment) {
      filtered = filtered.filter(d => d.department === this.selectedDepartment);
    }

    if (this.selectedStatus) {
      if (this.selectedStatus === 'Active') {
        filtered = filtered.filter(d => d.active === true);
      } else if (this.selectedStatus === 'Pending') {
        filtered = filtered.filter(d => d.active === false);
      }
    }

    this.filteredDoctors = filtered;
    this.updateTotalPages();
    this.currentPage = 1; // Reset to first page
  }

  private updateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredDoctors.length / this.itemsPerPage) || 1;
  }

  get paginatedDoctors(): Doctor[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredDoctors.slice(start, end);
  }

  // Smart pagination: shows current page ±2, with bounds
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
    }
  }

  editDoctor(id: number): void {
    this.router.navigate(['/hospital-admin/edit-doctor', id]);
  }

  deleteDoctor(id: number): void {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.hospitalAdminService.deleteDoctor(id).subscribe({
        next: () => {
          this.loadDoctors(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting doctor:', error);
          alert('Error deleting doctor: ' + (error.error?.message || 'Unknown error'));
        }
      });
    }
  }

  toggleDoctorStatus(doctor: Doctor): void {
    const newStatus = !doctor.active;
    this.hospitalAdminService.toggleDoctorStatus(doctor.id, newStatus).subscribe({
      next: () => {
        doctor.active = newStatus;
      },
      error: (error) => {
        console.error('Error updating doctor status:', error);
        alert('Error updating doctor status: ' + (error.error?.message || 'Unknown error'));
      }
    });
  }

  onImageError(event: any, doctor: Doctor): void {
    // Fallback to initials avatar if image fails to load
    const initials = this.getInitials(doctor.fullName);
    event.target.src = `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff&size=200&bold=true`;
  }

  // Force refresh - clears cache and reloads everything
  forceRefresh(): void {
    this.isLoading = true;
    this.doctors = [];
    this.filteredDoctors = [];
    
    // Clear any existing intervals and restart
    this.hospitalAdminService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.filteredDoctors = [...this.doctors];
        this.updateTotalPages();
        this.isLoading = false;
        this.lastRefreshTime = new Date();
        
        console.log('🔄 Force refresh completed at', this.lastRefreshTime.toLocaleTimeString());
        
        // Show a brief success message
        this.showStatusUpdateNotification = true;
        setTimeout(() => {
          this.showStatusUpdateNotification = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.isLoading = false;
      }
    });
  }

  private getInitials(fullName: string): string {
    if (!fullName || fullName.trim().length === 0) {
      return 'DR';
    }

    const parts = fullName.trim().split(/\s+/);
    let initials = '';

    for (let i = 0; i < Math.min(2, parts.length); i++) {
      if (parts[i].length > 0) {
        initials += parts[i].charAt(0);
      }
    }

    return initials.length > 0 ? initials.toUpperCase() : 'DR';
  }
}
