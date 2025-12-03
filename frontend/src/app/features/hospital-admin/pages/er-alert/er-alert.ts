import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/side.component';
import { RouterModule } from '@angular/router';

interface Doctor {
  id: number;
  name: string;
  avatar: string;
}

@Component({
  selector: 'app-er-alert',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './er-alert.html',
  styleUrls: ['./er-alert.css']
})
export class ErAlertComponent {
  doctors: Doctor[] = [
    { id: 1, name: 'Dr. Emily Carter', avatar: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/Avs496onKz.png' },
    { id: 2, name: 'Dr. Ben Adams', avatar: 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/t3xYw2eZdp.png' },
    { id: 3, name: 'Dr. Sarah Chen', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 4, name: 'Dr. Michael Ross', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  ];

  alertForm: FormGroup;
  isAlertSent = false; // ← Add this

  constructor(private fb: FormBuilder) {
    this.alertForm = this.fb.group({
      doctorId: ['', Validators.required],
      patientDetails: [''],
      bedNumber: [''],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    console.log('Form submitted!');
    console.log('Form valid?', this.alertForm.valid);
    console.log('Form values:', this.alertForm.value);
    console.log('Form errors:', this.alertForm.errors);

    // Check individual field errors
    Object.keys(this.alertForm.controls).forEach(key => {
      const control = this.alertForm.get(key);
      if (control?.errors) {
        console.log(`${key} errors:`, control.errors);
      }
    });

    if (this.alertForm.valid) {
      console.log('Alert Sent!', this.alertForm.value);
      this.isAlertSent = true;

      // Reset after 3 seconds
      setTimeout(() => {
        this.isAlertSent = false;
        this.alertForm.reset();
      }, 3000);
    } else {
      console.log('Form is invalid!');
    }
  }

  get selectedDoctor() {
    return this.doctors.find(d => d.id === Number(this.alertForm.get('doctorId')?.value));
  }
}
