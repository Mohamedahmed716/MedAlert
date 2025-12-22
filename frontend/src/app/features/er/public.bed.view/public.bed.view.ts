import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toast.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

interface PublicBedDTO {
  id: number;
  bedNumber: string;
  status: string;
}

@Component({
  selector: 'app-public-bed-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './public.bed.view.html',
  styleUrls: ['./public.bed.view.css']
})
export class PublicBedView implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  hospitalNameParam: string | null = null; // The raw string from URL
  displayHospitalName = ''; // The clean string for the UI title

  beds: PublicBedDTO[] = [];
  selectedBed: PublicBedDTO | null = null;

  guestName = '';
  visitReason = '';
  waitTimeMinutes: number | null = null;

  loading = false;

  ngOnInit() {
    // 1. Capture the 'name' from the URL
    // Ensure app.routes.ts has path: 'emergency/hospital/:name'
    this.hospitalNameParam = this.route.snapshot.paramMap.get('name');

    if (this.hospitalNameParam) {
      // 2. The URL param comes decoded by Angular (e.g., "City Hospital")
      this.displayHospitalName = this.hospitalNameParam;

      // 3. Load beds using this name
      this.loadBeds(this.hospitalNameParam);
    } else {
      console.error("No hospital name provided in URL");
      this.goBack();
    }
  }

  loadBeds(name: string) {
    this.loading = true;

    // 4. IMPORTANT: Encode the name again for the HTTP Request
    // "City Hospital" -> "City%20Hospital"
    const encodedName = encodeURIComponent(name);

    this.http.get<PublicBedDTO[]>(`http://localhost:8080/api/public/emergency/hospital/${encodedName}/beds`)
      .subscribe({
        next: (data) => {
          this.beds = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading beds', err);
          this.loading = false;
          this.toastService.error('Error', 'Could not load beds. Please check the hospital name.');
        }
      });
  }

  getIcon(status: string) {
    return status === 'AVAILABLE' ? '🛏️' : '⛔';
  }

  goBack() {
    this.router.navigate(['/emergency/hospitals']);
  }

  selectBed(bed: PublicBedDTO) {
    if (bed.status === 'AVAILABLE') {
      this.selectedBed = bed;
    }
  }

  clear() {
    this.selectedBed = null;
    this.guestName = '';
    this.visitReason = '';
    this.waitTimeMinutes = null;
  }

  confirm() {
    if (!this.selectedBed || !this.hospitalNameParam || !this.waitTimeMinutes) return;

    this.loading = true;

    const payload = {
      // Use the name we captured from the URL
      hospitalName: this.hospitalNameParam,
      bedId: this.selectedBed.id,
      guestName: this.guestName,
      reason: this.visitReason,
      waitTimeMinutes: this.waitTimeMinutes
    };

    this.http.post('http://localhost:8080/api/public/emergency/reserve', payload)
      .subscribe({
        next: () => {
          this.toastService.success(
            'ER Request Submitted!', 
            `Your request has been sent to ${this.hospitalNameParam} for approval. You have ${this.waitTimeMinutes} minutes to arrive once approved. Please wait for confirmation before proceeding to the ER.`
          );

          if (this.selectedBed) {
            this.selectedBed.status = 'RESERVED';
          }

          this.clear();
          this.loading = false;
        },
        error: (err) => {
          console.error('Reservation failed', err);
          this.toastService.error('Request Failed', 'Failed to submit ER request. Please try again.');
          this.loading = false;
          // Reload to refresh status
          if (this.hospitalNameParam) this.loadBeds(this.hospitalNameParam);
        }
      });
  }
}
