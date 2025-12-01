import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {SidebarComponent} from '../../components/sidebar/side.component';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  department: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorListComponent implements OnInit {

  doctors: Doctor[] = [
    { id: 1, name: 'Dr. Johnathan Smith', specialty: 'Cardiology', department: 'Medical', status: 'Active' },
    { id: 2, name: 'Dr. Amelia Jones', specialty: 'Neurology', department: 'Surgical', status: 'Active' },
    { id: 3, name: 'Dr. Benjamin Lee', specialty: 'Pediatrics', department: 'Outpatient', status: 'Inactive' },
    { id: 4, name: 'Dr. Sophia Martinez', specialty: 'Orthopedics', department: 'Surgical', status: 'Active' },
    { id: 5, name: 'Dr. William Chen', specialty: 'Dermatology', department: 'Outpatient', status: 'Active' },
    { id: 6, name: 'Dr. Olivia Brown', specialty: 'Cardiology', department: 'Medical', status: 'Inactive' },
    { id: 7, name: 'Dr. Michael Davis', specialty: 'Neurology', department: 'Surgical', status: 'Active' },
    { id: 8, name: 'Dr. Emma Wilson', specialty: 'Pediatrics', department: 'Outpatient', status: 'Active' },
    // Add more if you want
  ];

  filteredDoctors: Doctor[] = [];
  searchTerm = '';
  selectedSpecialty = '';
  selectedDepartment = '';
  selectedStatus: 'Active' | 'Inactive' | '' = '';

  currentPage = 1;
  itemsPerPage = 6; // Looks best with cards
  totalPages = 1;

  specialties = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'];
  departments = ['Medical', 'Surgical', 'Outpatient', 'Emergency'];

  ngOnInit(): void {
    this.filteredDoctors = [...this.doctors];
    this.updateTotalPages();
  }

  filterDoctors(): void {
    let filtered = this.doctors;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(term) ||
        d.specialty.toLowerCase().includes(term)
      );
    }

    if (this.selectedSpecialty) {
      filtered = filtered.filter(d => d.specialty === this.selectedSpecialty);
    }

    if (this.selectedDepartment) {
      filtered = filtered.filter(d => d.department === this.selectedDepartment);
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(d => d.status === this.selectedStatus);
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
    // Later: this.router.navigate(['/add-doctor', id]);
  }

  deleteDoctor(id: number): void {

      this.doctors = this.doctors.filter(d => d.id !== id);
      this.filterDoctors();

  }
}
