import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Import Router
import { SidebarComponent } from '../../components/sidebar/side.component';
import { FilterPipe } from '../../components/filter';
interface Doctor {
  id: number;
  name: string;
  title: string;
  officeHours: string;
  bio: string;
  avatar: string;
}

@Component({
  selector: 'app-doctors-department',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule,FilterPipe],
  templateUrl: './doctors-departments.html',
  styleUrls: ['./doctors-departments.css']
})
export class DoctorsDepartmentComponent {
  currentDepartment = 'Cardiology';

  departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'];

  doctors: Doctor[] = [
    {
      id: 1,
      name: 'Dr. Emily Carter',
      title: 'Cardiologist',
      officeHours: 'Mon - Fri, 9:00 AM - 5:00 PM',
      bio: 'Dr. Carter is a board-certified cardiologist with over 15 years of experience...',
      avatar: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/Avs496onKz.png'
    },
    {
      id: 2,
      name: 'Dr. Ben Adams',
      title: 'Interventional Cardiologist',
      officeHours: 'Tue, Thu, 10:00 AM - 7:00 PM',
      bio: 'Specializing in minimally invasive heart procedures...',
      avatar: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/t3xYw2eZdp.png'
    }
  ];

  searchTerm = '';

  constructor(private router: Router) {} // Inject Router

  goToDoctorDetail(id: number) {
    this.router.navigate(['/hospital-admin/doctors', id]);
    // Or if you have a detail page: this.router.navigate(['/doctors/detail', id]);
  }

  addDoctor() {
    this.router.navigate(['/hospital-admin/add-doctor']);
  }

  addDepartment() {
    this.router.navigate(['/hospital-admin/departments/add']);
  }
}
