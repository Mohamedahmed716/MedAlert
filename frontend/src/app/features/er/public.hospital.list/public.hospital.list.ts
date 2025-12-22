import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

interface HospitalResponse {
  id: number;
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  website: string;
  phoneNumber: string;
  status: string;
  adminEmail: string;
}

@Component({
  selector: 'app-public-hospital-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ToastComponent],
  templateUrl: './public.hospital.list.html',
  styleUrls: ['./public.hospital.list.css']
})
export class PublicHospitalList implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(ToastService);

  searchText = '';
  hospitals: HospitalResponse[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.fetchHospitals();
  }

  fetchHospitals() {
    this.loading = true;
    this.http.get<HospitalResponse[]>('http://localhost:8080/api/public/emergency/hospitals')
      .subscribe({
        next: (data) => {
          this.hospitals = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load hospitals', err);
          this.error = 'Could not load hospital list. Please try again.';
          this.toastService.error('Error', 'Could not load hospital list. Please try again.');
          this.loading = false;
        }
      });
  }

  // --- MODIFICATION HERE ---
  // You can use this function in your HTML: (click)="openHospital(h.name)"
  // This ensures the name is safe to put in the URL
  openHospital(name: string) {
    if(!name) return;
    this.router.navigate(['/emergency/hospital', name]);
  }

  get filteredHospitals() {
    const term = this.searchText.toLowerCase();
    return this.hospitals.filter(h =>
      (h.name && h.name.toLowerCase().includes(term)) ||
      (h.city && h.city.toLowerCase().includes(term)) ||
      (h.state && h.state.toLowerCase().includes(term)) ||
      (h.zipCode && h.zipCode.includes(term))
    );
  }
}
