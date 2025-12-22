import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface Bed {
  bedNumber: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED';
}

@Component({
  selector: 'app-public-bed-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public.bed.view.html',
  styleUrls: ['./public.bed.view.css'],
})
export class PublicBedView implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  hospitalName = 'Loading...';
  beds: Bed[] = [];
  selectedBed: Bed | null = null;
  guestName = '';
  visitReason = '';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.hospitalName = id === '1' ? 'Central City Hospital' : 'Community General';

    // Mock Data Loading
    setTimeout(() => {
      this.beds = [
        { bedNumber: 'ER-01', status: 'OCCUPIED' },
        { bedNumber: 'ER-02', status: 'AVAILABLE' },
        { bedNumber: 'ER-03', status: 'AVAILABLE' },
        { bedNumber: 'ER-04', status: 'OCCUPIED' },
        { bedNumber: 'ER-05', status: 'AVAILABLE' },
      ];
    }, 500);
  }

  getIcon(status: string) { return status === 'AVAILABLE' ? '🛏️' : '⛔'; }
  goBack() { this.router.navigate(['/emergency/hospitals']); }

  selectBed(bed: Bed) {
    if (bed.status === 'AVAILABLE') this.selectedBed = bed;
  }

  clear() {
    this.selectedBed = null;
    this.guestName = '';
    this.visitReason = '';
  }

  confirm() {
    console.log(`Guest ${this.guestName} reserving bed ${this.selectedBed?.bedNumber} for ${this.visitReason}`);
    alert('Reservation Confirmed! Please proceed to the ER.');

    // Optimistic Update
    if (this.selectedBed) this.selectedBed.status = 'RESERVED';
    this.clear();
  }
}
