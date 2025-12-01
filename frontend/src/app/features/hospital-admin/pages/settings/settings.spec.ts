import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HospitalData {
  name: string;
  address: string;
  phone: string;
  email: string;
  info: string;
  logo: File | null;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  activeTab = 'Hospital Profile';
  isDirty = false;
  isSaving = false;

  tabs = ['Hospital Profile', 'Departments', 'Doctor Onboarding', 'Patient Communication'];

  // Beautiful hospital logo (already loaded)
  defaultLogoUrl = 'https://cdn-icons-png.flaticon.com/512/2966/2966335.png';

  hospital: HospitalData = {
    name: 'City General Hospital',
    address: '123 Health St, Medville, USA',
    phone: '(123) 456-7890',
    email: 'contact@citygeneral.com',
    info: 'City General Hospital is a leading healthcare provider committed to delivering compassionate and high-quality medical care to our community.',
    logo: null
  };

  logoPreviewUrl = this.defaultLogoUrl;
  private originalData!: HospitalData;

  constructor() {
    this.saveOriginalState();
  }

  private saveOriginalState(): void {
    this.originalData = { ...this.hospital };
  }

  setActiveTab(tab: string): void {
    if (this.isDirty && !confirm('You have unsaved changes. Switch tab anyway?')) return;
    this.cancelChanges();
    this.activeTab = tab;
  }

  markAsDirty(): void {
    this.isDirty = true;
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;

    const file = input.files[0];
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Max 10MB allowed.');
      return;
    }

    this.hospital.logo = file;
    this.isDirty = true;

    const reader = new FileReader();
    reader.onload = (e) => this.logoPreviewUrl = e.target?.result as string;
    reader.readAsDataURL(file);
  }

  removeLogo(): void {
    this.hospital.logo = null;
    this.logoPreviewUrl = this.defaultLogoUrl;
    this.isDirty = true;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  cancelChanges(): void {
    this.hospital = { ...this.originalData };
    this.logoPreviewUrl = this.hospital.logo ? this.logoPreviewUrl : this.defaultLogoUrl;
    this.isDirty = false;
  }

  async saveChanges(): Promise<void> {
    if (!this.isDirty) return;
    this.isSaving = true;
    await new Promise(r => setTimeout(r, 1500));
    alert('Settings saved successfully!');
    this.isSaving = false;
    this.isDirty = false;
    this.saveOriginalState();
  }
}
