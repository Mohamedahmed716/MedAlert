import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  showNotifications = false;
  currentDate: Date = new Date()

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
}
