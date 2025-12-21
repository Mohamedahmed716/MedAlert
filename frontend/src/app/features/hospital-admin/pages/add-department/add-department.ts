import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/side.component';
import { RouterModule, Router } from '@angular/router';
import { HospitalAdminService, CreateDepartmentRequest } from '../../services/hospital-admin.service';
import { ToastService } from '../../../../shared/services/toast.service';

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
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private hospitalAdminService: HospitalAdminService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      shortCode: [''],
      headOfDepartment: [''],
      phone: [''],
      email: ['', Validators.email], // Email validation but not required
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
    if (this.departmentForm.valid) {
      this.isLoading = true;
      
      const formValue = this.departmentForm.value;
      const request: CreateDepartmentRequest = {
        name: formValue.name,
        shortCode: formValue.shortCode,
        headOfDepartment: formValue.headOfDepartment,
        phone: formValue.phone,
        email: formValue.email,
        description: formValue.description
      };

      this.hospitalAdminService.createDepartment(request).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          this.toastService.success('Success', 'Department created successfully!');
          console.log('Department created:', response.name);
          
          // Reset form
          this.departmentForm.reset();
          this.previewUrl = null;
          
          // Navigate back after success
          setTimeout(() => {
            this.router.navigate(['/hospital-admin/doctors-departments']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating department:', error);
          
          let errorMessage = 'Unknown error';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.toastService.error('Error', 'Failed to create department: ' + errorMessage);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.departmentForm.controls).forEach(key => {
        this.departmentForm.get(key)?.markAsTouched();
      });
    }
  }
}
