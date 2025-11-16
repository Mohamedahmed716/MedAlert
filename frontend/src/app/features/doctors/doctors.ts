import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Sidebar} from './components/sidebar/sidebar';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-doctors',
  imports: [
    CommonModule,
    RouterOutlet,
    Sidebar
  ],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css',
})
export class Doctors {

}
