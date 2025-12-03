import { Component } from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-er',
  imports: [
    NgClass
  ],
  templateUrl: './er.html',
  styleUrl: './er.css',
  standalone: true
})
export class Er {
  // Sample data for ER beds
  beds = [
    {id : 'ER-1', status: 'Available'},
    {id : 'ER-2', status: 'Occupied'},
    {id : 'ER-3', status: 'Occupied'},
    {id : 'ER-4', status: 'Available'},
    {id : 'ER-5', status: 'Occupied'},
    {id : 'ER-6', status: 'Available'},
    {id : 'ER-7', status: 'Available'},
    {id : 'ER-8', status: 'Occupied'},
  ];
}
