import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/side.component';
import {TopbarComponent} from './components/topbar/topbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './Hospital-admin.html',
  styleUrl: './Hospital-admin.css'
})
export class HospitalAdmin {}
