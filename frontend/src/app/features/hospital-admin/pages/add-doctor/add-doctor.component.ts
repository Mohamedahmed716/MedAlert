import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import { HospitalAdminService, CreateDoctorRequest, Doctor } from '../../services/hospital-admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';

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
export class AddDoctorComponent implements OnInit {
  doctorForm: FormGroup;
  previewUrl: string | null = null;
  isLoading = false;
  isEditMode = false;
  doctorId: number | null = null;
  currentDoctor: Doctor | null = null;

  availability: DayAvailability[] = [
    { day: 'Mon', checked: true,  startTime: '09:00', endTime: '17:00' },
    { day: 'Tue', checked: true,  startTime: '09:00', endTime: '13:00' },
    { day: 'Wed', checked: false, startTime: '',      endTime: '' },
    { day: 'Thu', checked: true,  startTime: '10:00', endTime: '18:00' },
    { day: 'Fri', checked: false, startTime: '',      endTime: '' },
  ];

  departments: string[] = [];

  constructor(
    private fb: FormBuilder,
    private hospitalAdminService: HospitalAdminService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.doctorForm = this.fb.group({
      fullName: ['', Validators.required],
      department: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: [''],
      bio: ['']
    });
    
    this.loadDepartments();
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.doctorId = +params['id'];
        this.loadDoctorForEdit();
      }
    });
  }

  loadDoctorForEdit(): void {
    if (!this.doctorId) return;
    
    this.isLoading = true;
    // Get all doctors and find the one we want to edit
    this.hospitalAdminService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.currentDoctor = doctors.find(d => d.id === this.doctorId) || null;
        if (this.currentDoctor) {
          this.populateForm();
        } else {
          console.error('Doctor not found');
          this.router.navigate(['/hospital-admin/doctors']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading doctor:', error);
        this.isLoading = false;
        this.router.navigate(['/hospital-admin/doctors']);
      }
    });
  }

  populateForm(): void {
    if (!this.currentDoctor) return;

    this.doctorForm.patchValue({
      fullName: this.currentDoctor.fullName,
      department: this.currentDoctor.department,
      phone: this.currentDoctor.phoneNumber,
      email: this.currentDoctor.email,
      // Don't populate password for security
      password: '',
      dateOfBirth: '', // We don't have this in the current Doctor interface
      gender: '', // We don't have this in the current Doctor interface
      address: '', // We don't have this in the current Doctor interface
      bio: this.currentDoctor.bio || ''
    });

    // Make password optional in edit mode
    this.doctorForm.get('password')?.clearValidators();
    this.doctorForm.get('password')?.updateValueAndValidity();
  }

  loadDepartments(): void {
    this.hospitalAdminService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        // Fallback to default departments
        this.departments = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'General Medicine'];
      }
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
    if (this.doctorForm.valid) {
      this.isLoading = true;
      
      const formValue = this.doctorForm.value;
      const request: CreateDoctorRequest = {
        fullName: formValue.fullName,
        email: formValue.email,
        password: formValue.password,
        department: formValue.department,
        phoneNumber: formValue.phone,
        address: formValue.address,
        bio: formValue.bio,
        dateOfBirth: formValue.dateOfBirth,
        gender: formValue.gender,
        availability: this.availability.filter(d => d.checked).map(d => ({
          day: d.day,
          checked: d.checked,
          startTime: d.startTime,
          endTime: d.endTime
        }))
      };

      if (this.isEditMode && this.doctorId) {
        // Update existing doctor
        this.hospitalAdminService.updateDoctor(this.doctorId, request).subscribe({
          next: () => {
            this.isLoading = false;
            this.toastService.success('Success', 'Doctor updated successfully!');
            
            // Navigate back after success
            setTimeout(() => {
              this.router.navigate(['/hospital-admin/doctors']);
            }, 1500);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error updating doctor:', error);
            this.toastService.error('Error', 'Failed to update doctor: ' + (error.error?.message || 'Unknown error'));
          }
        });
      } else {
        // Create new doctor
        this.hospitalAdminService.createDoctor(request).subscribe({
          next: () => {
            this.isLoading = false;
            
            // Reset form
            this.doctorForm.reset();
            this.previewUrl = null;
          
            this.toastService.success(
              'Doctor Created Successfully!', 
              'The doctor account is pending system admin approval before becoming active.'
            );
            
            // Navigate after showing success
            setTimeout(() => {
              this.router.navigate(['/hospital-admin/doctors']);
            }, 2000);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error creating doctor:', error);
            this.toastService.error('Error', 'Failed to create doctor: ' + (error.error?.message || 'Unknown error'));
          }
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.doctorForm.controls).forEach(key => {
        this.doctorForm.get(key)?.markAsTouched();
      });
    }
  }
}
