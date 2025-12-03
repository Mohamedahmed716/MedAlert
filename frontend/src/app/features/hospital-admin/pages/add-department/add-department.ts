import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/side.component';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './add-department.html',
  styleUrls: ['./add-department.css']
})
export class AddDepartmentComponent {
  departmentForm: FormGroup;
  previewUrl: string | null = null;
  showSuccessPopup = false;

  constructor(private fb: FormBuilder) {
    this.departmentForm = this.fb.group({
      name: [''],
      shortCode: [''],
      headOfDepartment: [''],
      phone: [''],
      email: [''],
      description: ['']
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

  onSubmit() {
    console.log('Form submitted!');
    const formValue = this.departmentForm.value;
    console.log('Department Data:', formValue);

    // Show success popup
    this.showSuccessPopup = true;

    // Hide popup after 3 seconds
    setTimeout(() => {
      this.showSuccessPopup = false;
    }, 3000);
  }
}
