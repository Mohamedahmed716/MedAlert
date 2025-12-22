import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HospitalService } from '../../services/hospital.service'; // Adjust path

@Component({
  selector: 'app-hospitaldashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './hospitaldashboard.html',
  styleUrls: ['./hospitaldashboard.css']
})
export class Hospitaldashboard implements OnInit {
  hospital: any;

  constructor(
    private route: ActivatedRoute,
    private hospitalService: HospitalService
  ) {}

  ngOnInit(): void {
    // Get the numeric ID for fetching hospital details
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.hospitalService.getHospitalById(+id).subscribe({
        next: (data) => this.hospital = data,
        error: (err) => console.error('Error loading hospital', err)
      });
    }
  }
}