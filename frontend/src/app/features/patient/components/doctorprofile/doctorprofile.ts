import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-profile',
  imports:[CommonModule ,RouterLink],
  templateUrl: './doctorprofile.html',
  styleUrls: ['./doctorprofile.css']
})
export class Doctorprofile {

  activeTab: string = 'bio';

  doctor = {
    name: "Dr. Amelia Thorne",
    specialty: "Pediatrician",
    experience: "12 years of experience",
    image:        "https://lh3.googleusercontent.com/aida-public/AB6AXuC_ZIDb5fiNJY-Hy_NPiDw6m1sfg9vbBjRxXdDrxc63HCCduaYxM_mgEn3UeJBo-VVKtHsPWDPgFqSPCtbZVHSQmzFAo-zpQrYLUWRvd8M5tNRTIkbFEPpfBu0BTwT_lEsJWIIe41_OafIC1AU6jHiHwS3dYWcn7go5x-R53SrE6lMt6hLpUgFzE88IC68pJT6TOUUCUHEllXhZYM5Z3gtaw9NaiTWt_IrjFtIO0azRUCPPE-4XocGlOTF7OZTJ-jR6k7dIpcbln-c"

  };

  biography = `
    Dr. Amelia Thorne is a board-certified pediatrician with over 12 years of
    experience providing compassionate and comprehensive care for children from
    infancy through adolescence. She is passionate about preventative care and
    building lasting relationships with her patients and their families.
  `;

  qualifications = [
    "MD – Harvard Medical School",
    "Residency – Boston Children’s Hospital",
    "Fellowship – Pediatric Medicine",
    "Certified in Pediatric Advanced Life Support (PALS)"
  ];

  languages = ["English", "Spanish", "French"];

  selectedTime: string | null = null;

  timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM", "02:00 PM"
  ];

  selectSlot(slot: string) {
    this.selectedTime = slot;
  }

  makeReservation() {
    if (!this.selectedTime) {
      alert("Please select a time slot");
      return;
    }
    alert("Reservation confirmed for " + this.selectedTime);
  }

}
