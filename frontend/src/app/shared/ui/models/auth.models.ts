export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  role: string;
  gender: 'Male' | 'Female';
  hospitalId?: string | null;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
  gender?: string;
  profilePhotoUrl?: string;
}

export interface Hospital {
  id?: number;
  name: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  website?: string;
  location?: string;
  status?: string;
}

export interface HospitalStats {
  totalHospitals: number;
  operational: number;
  maintenance: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
  dateCreated: string;
  hospitalId?: string;
  gender?: string;
  profilePhotoUrl?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
}
