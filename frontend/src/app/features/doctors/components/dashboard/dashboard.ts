import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
    reservations = [
        {name: 'John Doe', time: '10:00 AM', condition: 'Flu' },
        {name: 'Jane Smith', time: '11:00 AM', condition: 'Flu' },
        {name: 'Alice Johnson', time: '09:30 AM', condition: 'Flu' },
    ];
    pending_res = 2; // Example pending reservations count

    currentDate = new Date();
    shift = ["9:00 AM", "5:00 PM"];
    er_occ = 75; // Example occupancy percentage
    crit_cases = 5; // Example critical cases count

    patients = [
        {name: 'Michael Brown', room: "302", condition: 'Diabetes' },
        {name: 'Emily Davis', room: "305", condition: 'Hypertension' },
        {name: 'Daniel Wilson', room: "308", condition: 'Arthritis' },
    ];

    pending_patients = 12; // Example pending patients count

    prescriptions = [
        {name: 'Olivia Martinez', medication: "Atorvastatin", dosage: '10mg', date: '2024-06-15' },
        {name: 'Liam Garcia', medication: "Lisinopril", dosage: '20mg', date: '2024-06-15' },
        {name: 'Sophia Rodriguez', medication: "Metformin", dosage: '500mg', date: '2024-06-15' },
    ];
}
