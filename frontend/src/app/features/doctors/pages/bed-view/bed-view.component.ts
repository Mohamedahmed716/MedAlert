import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService, Bed, BedStats } from '../../doctor.service';

@Component({
  selector: 'app-bed-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bed-view.component.html',
  styleUrls: ['./bed-view.component.css']
})
export class BedViewComponent implements OnInit {
  private doctorService = inject(DoctorService);

  beds: Bed[] = [];
  bedStats: BedStats | null = null;
  loading = false;
  error = '';

  ngOnInit() {
    this.loadBeds();
    this.loadBedStats();
  }

  loadBeds() {
    this.loading = true;
    this.doctorService.getAllBeds().subscribe({
      next: (beds) => {
        this.beds = beds;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading beds:', error);
        this.error = 'Failed to load beds';
        this.loading = false;
      }
    });
  }

  loadBedStats() {
    this.doctorService.getBedStats().subscribe({
      next: (stats) => {
        this.bedStats = stats;
      },
      error: (error) => {
        console.error('Error loading bed stats:', error);
      }
    });
  }

  refreshBeds() {
    this.loadBeds();
    this.loadBedStats();
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
}