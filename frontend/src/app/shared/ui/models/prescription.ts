import { Doctor } from './doctor';
import { Patient } from './patient';

export interface Prescription {
  id: number;
  doctor: Doctor;
  patient: Patient;
  medicationName: string;
  dosage: string;
  frequency: string;
  durationInDays: number;
  prescribedDate: string; // ISO Date
  instructions: string;
  status: string;
}
