import {User} from './auth.models';
import { Prescription } from './prescription';
import { Reservation } from './reservation';

export interface Doctor {
  id: number;
  user: User; // The linked User account
  specialty: string;
  phoneNumber: string;
  // Relationships are optional (?) to prevent infinite loops if the API doesn't send them
  prescriptions?: Prescription[];
  reservations?: Reservation[];
}
