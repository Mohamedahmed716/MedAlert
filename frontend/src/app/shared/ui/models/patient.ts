import {User} from './auth.models';
import { Prescription } from './prescription';
import { Reservation } from './reservation';

export interface Patient {
  id: number;
  user: User; // The linked User account
  dateOfBirth: string;
  bloodType: string;
  medicalHistory: string;
  prescriptions?: Prescription[];
  reservations?: Reservation[];
}
