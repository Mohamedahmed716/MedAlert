import { DurationTime } from './enums';

export interface Prescription {
  id: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: number;
  durationTime: DurationTime;
  prescribedDate: string;
  instructions: string;
  patientName: string;
}
