import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HospitalService } from '../../services/hospital.service'; 

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hospitaldepartments.html',
  styleUrls: ['./hospitaldepartments.css']
})
export class Hospitaldepartments implements OnInit {
  hospitalId: string | null = null;
  departments: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private hospitalService: HospitalService
  ) {}

  ngOnInit(): void {
    this.hospitalId = this.route.snapshot.paramMap.get('id');
    if (this.hospitalId) {
      this.hospitalService.getDepartments(this.hospitalId).subscribe({
        next: (data) => this.departments = data,
        error: (err) => console.error('Error loading departments', err)
      });
    }
  }
}