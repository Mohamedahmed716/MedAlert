import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import {SidebarComponent} from '../../components/sidebar/side.component';

interface DayAvailability {
  day: string;
  checked: boolean;
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-add-doctor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css']
})
export class AddDoctorComponent {
  doctorForm: FormGroup;
  previewUrl: string | null = null;
  showSuccessPopup = false;

  availability: DayAvailability[] = [
    { day: 'Mon', checked: true,  startTime: '09:00', endTime: '17:00' },
    { day: 'Tue', checked: true,  startTime: '09:00', endTime: '13:00' },
    { day: 'Wed', checked: false, startTime: '',      endTime: '' },
    { day: 'Thu', checked: true,  startTime: '10:00', endTime: '18:00' },
    { day: 'Fri', checked: false, startTime: '',      endTime: '' },
  ];

  departments = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General Medicine'];

  constructor(private fb: FormBuilder) {
    this.doctorForm = this.fb.group({
      fullName: [''],
      specialty: [''],
      department: [''],
      phone: [''],
      email: [''],
      bio: ['']
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      reader.readAsDataURL(file);
    }
  }

  toggleDay(day: DayAvailability) {
    day.checked = !day.checked;
    if (!day.checked) {
      day.startTime = '';
      day.endTime = '';
    }
  }

  onSubmit() {
    console.log('Form submitted!');
    console.log('Doctor Data:', this.doctorForm.value);
    console.log('Availability:', this.availability.filter(d => d.checked));

    // Show success popup
    this.showSuccessPopup = true;

    // Hide popup after 3 seconds
    setTimeout(() => {
      this.showSuccessPopup = false;
    }, 3000);
  }
}
