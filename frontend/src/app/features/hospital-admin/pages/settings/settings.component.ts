import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/side.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hospital-profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class HospitalProfileSettingsComponent {
  activeTab: string = 'hospital-profile';
  hospitalForm: FormGroup;
  logoPreview = 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/91L5D7eeQx.png';
  isDragging = false;
  showSuccessPopup = false;

  constructor(private fb: FormBuilder) {
    this.hospitalForm = this.fb.group({
      name: ['City General Hospital', Validators.required],
      address: ['123 Health St, Medville, USA', Validators.required],
      phone: ['(123) 456-7890'],
      email: ['contact@citygeneral.com', [Validators.required, Validators.email]],
      description: [`City General Hospital is a leading healthcare provider committed to delivering compassionate and high-quality medical care to our community.`]
    });
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files[0]) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => this.logoPreview = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  removeLogo() {
    this.logoPreview = '';
  }

  onSave() {
    console.log('Saving hospital profile:', this.hospitalForm.value);

    // Show success popup
    this.showSuccessPopup = true;

    // Hide popup after 3 seconds
    setTimeout(() => {
      this.showSuccessPopup = false;
    }, 3000);
  }

  onCancel() {
    this.hospitalForm.reset({
      name: 'City General Hospital',
      address: '123 Health St, Medville, USA',
      phone: '(123) 456-7890',
      email: 'contact@citygeneral.com',
      description: `City General Hospital is a leading healthcare provider...`
    });
    this.logoPreview = 'https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-11-30/91L5D7eeQx.png';
  }
}
