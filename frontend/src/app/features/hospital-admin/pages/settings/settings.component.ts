import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../../components/sidebar/side.component';
import { RouterModule } from '@angular/router';
import { HospitalAdminService } from '../../services/hospital-admin.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-hospital-profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class HospitalProfileSettingsComponent implements OnInit {
  hospitalForm: FormGroup;
  passwordForm: FormGroup;
  logoPreview = '';
  isDragging = false;
  showSuccessPopup = false;
  showPasswordSection = false;
  isLoading = false;
  currentUser: any = null;
  currentHospital: any = null;

  constructor(
    private fb: FormBuilder,
    private hospitalAdminService: HospitalAdminService,
    private userService: UserService
  ) {
    this.hospitalForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      description: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadUserData();
    this.loadHospitalData();
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  loadUserData(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        
        // Extract hospital name from email
        const hospitalName = this.extractHospitalNameFromEmail(user.email);
        
        this.hospitalForm.patchValue({
          email: user.email,
          name: hospitalName
        });
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      }
    });
  }

  extractHospitalNameFromEmail(email: string): string {
    if (!email) return 'Hospital Name';
    
    // Extract the domain part (everything after @)
    const domain = email.split('@')[1];
    if (!domain) return 'Hospital Name';
    
    // Remove .com, .org, etc. and get the main part
    const hospitalPart = domain.split('.')[0];
    
    // Convert to title case
    const formattedName = hospitalPart
      .split(/[-_]/) // Split on hyphens or underscores
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Check if the name already contains "hospital" (case insensitive)
    if (formattedName.toLowerCase().includes('hospital')) {
      return formattedName; // Don't add "Hospital" if it's already there
    } else {
      return formattedName + ' Hospital'; // Add "Hospital" if it's not there
    }
  }

  loadHospitalData(): void {
    // For now, we'll use the hospital ID from the user to get hospital name
    // In a real app, you'd have a separate hospital service
    this.hospitalAdminService.getDashboardStats().subscribe({
      next: (stats) => {
        // We can get hospital info from other sources or create a new endpoint
        this.loadHospitalInfo();
      },
      error: (error) => {
        console.error('Error loading hospital data:', error);
        // Set default values if we can't load hospital data
        this.hospitalForm.patchValue({
          name: 'Hospital Name',
          description: 'Hospital description...'
        });
      }
    });
  }

  loadHospitalInfo(): void {
    // Hospital name is now loaded from the user's email in loadUserData()
    // Just set the description here
    this.hospitalForm.patchValue({
      description: 'A leading healthcare provider committed to delivering exceptional medical care and compassionate service to our community. We offer comprehensive medical services with state-of-the-art facilities and experienced healthcare professionals.'
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

  togglePasswordSection() {
    this.showPasswordSection = !this.showPasswordSection;
    if (!this.showPasswordSection) {
      this.passwordForm.reset();
    }
  }

  onSave() {
    if (this.hospitalForm.valid) {
      this.isLoading = true;
      console.log('Saving hospital profile:', this.hospitalForm.value);

      // Here you would typically call an API to save the hospital data
      // For now, we'll just simulate a successful save
      setTimeout(() => {
        this.isLoading = false;
        this.showSuccessPopup = true;

        setTimeout(() => {
          this.showSuccessPopup = false;
        }, 3000);
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.hospitalForm.controls).forEach(key => {
        this.hospitalForm.get(key)?.markAsTouched();
      });
    }
  }

  onPasswordReset() {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      
      const currentPassword = this.passwordForm.get('currentPassword')?.value;
      const newPassword = this.passwordForm.get('newPassword')?.value;
      
      this.hospitalAdminService.changePassword(currentPassword, newPassword).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showSuccessPopup = true;
          this.showPasswordSection = false;
          this.passwordForm.reset();
          
          console.log('Password changed successfully:', response.message);
          
          setTimeout(() => {
            this.showSuccessPopup = false;
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error changing password:', error);
          
          let errorMessage = 'Failed to change password';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.error) {
            errorMessage = error.error.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          alert('Error: ' + errorMessage);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.passwordForm.controls).forEach(key => {
        this.passwordForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.loadUserData();
    this.loadHospitalData();
    this.logoPreview = '';
    this.showPasswordSection = false;
    this.passwordForm.reset();
  }
}
