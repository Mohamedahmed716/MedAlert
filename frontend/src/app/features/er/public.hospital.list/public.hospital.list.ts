import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-hospital-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './public.hospital.list.html',
  styleUrls: ['./public.hospital.list.css']
})
export class PublicHospitalList {
  searchText = '';

  // Mock Data
  hospitals = [
    { id: '1', name: 'Central City Hospital', city: 'Downtown', state: 'NY' },
    { id: '2', name: 'St. Mary General', city: 'Westside', state: 'NY' },
    { id: '3', name: 'Community Medical Center', city: 'Uptown', state: 'NY' }
  ];

  get filteredHospitals() {
    return this.hospitals.filter(h =>
      h.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      h.city.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
