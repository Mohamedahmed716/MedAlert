import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/side.component';
import { HospitalAdminService, Doctor } from '../../services/hospital-admin.service';

@Component({
  selector: 'app-doctors-department',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './doctors-departments.html',
  styleUrls: ['./doctors-departments.css']
})
export class DoctorsDepartmentComponent implements OnInit, AfterViewInit {
  currentDepartment = 'All';
  departments: string[] = ['All'];
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  searchTerm = '';
  isLoading = false;

  constructor(
    private router: Router,
    private hospitalAdminService: HospitalAdminService
  ) {}

  ngOnInit(): void {
    this.loadDoctors();

    // Auto-refresh disabled - use manual refresh instead
    // setInterval(() => {
    //   this.refreshDoctorsQuietly();
    // }, 30000);
  }

  ngAfterViewInit(): void {
    // Refresh departments when returning from add department page
    this.loadDepartments();
  }

  loadDoctors(): void {
    this.isLoading = true;
    this.hospitalAdminService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.loadDepartments();
        this.filterDoctors();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading doctors:', error);
        this.isLoading = false;
      }
    });
  }

  // Refresh doctors data without showing loading indicator
  refreshDoctorsQuietly(): void {
    this.hospitalAdminService.getAllDoctors().subscribe({
      next: (doctors) => {
        // Check if there are any status changes
        const hasChanges = this.doctors.some(oldDoctor => {
          const newDoctor = doctors.find(d => d.id === oldDoctor.id);
          return newDoctor && newDoctor.active !== oldDoctor.active;
        });

        if (hasChanges) {
          this.doctors = doctors;
          this.loadDepartments();
          this.filterDoctors(); // Re-apply current filters
          console.log('Doctor statuses updated from system admin approval');
        }
      },
      error: (error) => {
        console.error('Error refreshing doctors:', error);
      }
    });
  }

  loadDepartments(): void {
    // Load departments from backend and add 'All' option
    this.hospitalAdminService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = ['All', ...departments];
        console.log('Departments loaded:', departments);
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        // Fallback to extracting from doctors if API fails
        const uniqueDepartments = [...new Set(this.doctors.map(d => d.department))];
        this.departments = ['All', ...uniqueDepartments.sort()];
      }
    });
  }

  filterDoctors(): void {
    let filtered = this.doctors;

    // Filter by department
    if (this.currentDepartment !== 'All') {
      filtered = filtered.filter(d => d.department === this.currentDepartment);
    }

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        d.fullName.toLowerCase().includes(term) ||
        d.department.toLowerCase().includes(term)
      );
    }

    this.filteredDoctors = filtered;
  }

  onDepartmentChange(): void {
    this.filterDoctors();
  }

  onSearchChange(): void {
    this.filterDoctors();
  }

  goToDoctorDetail(id: number) {
    this.router.navigate(['/hospital-admin/edit-doctor', id]);
  }

  addDoctor() {
    this.router.navigate(['/hospital-admin/add-doctor']);
  }

  addDepartment() {
    this.router.navigate(['/hospital-admin/departments/add']);
  }

  onImageError(event: any, doctor: Doctor): void {
    // Fallback to initials avatar if image fails to load
    const initials = this.getInitials(doctor.fullName);
    event.target.src = `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff&size=200&bold=true`;
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
