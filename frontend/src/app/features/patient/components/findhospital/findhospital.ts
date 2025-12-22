import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Hospital,HospitalService } from '../../services/hospital.service';


@Component({
  selector: 'app-findhospital',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './findhospital.html',
  styleUrl: './findhospital.css',
})
export class Findhospital implements OnInit {
  hospitals: Hospital[] = [];
  searchText: string = '';

  constructor(private HospitalService: HospitalService) {}

  ngOnInit(): void {
    this.HospitalService.getHospitals().subscribe({
      next: (data) => this.hospitals = data,
      error: (err) => console.error('Error loading hospitals', err)
    });
  }

  get filteredHospitals() {
    return this.hospitals.filter(h => 
      h.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      h.city.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}