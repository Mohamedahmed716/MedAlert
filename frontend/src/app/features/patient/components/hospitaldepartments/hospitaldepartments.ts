import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-department-list',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './hospitaldepartments.html',
  styleUrls: ['./hospitaldepartments.css']
})
export class Hospitaldepartments {

  hospitalName = "St. Jude's Hospital";

  departments = [
    {
      name: "Cardiology",
      description: "Specializes in heart and blood vessel disorders.",
      icon: "❤️"
    },
    {
      name: "Orthopedics",
      description: "Focuses on the musculoskeletal system.",
      icon: "🦴"
    },
    {
      name: "Neurology",
      description: "Deals with disorders of the nervous system.",
      icon: "🧠"
    },
    {
      name: "Pediatrics",
      description: "Medical care of infants, children, and adolescents.",
      icon: "👶"
    },
    {
      name: "Oncology",
      description: "Diagnosis and treatment of cancer.",
      icon: "🎗️"
    }
  ];

}
