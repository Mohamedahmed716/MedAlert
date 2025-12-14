import { Patient } from './patient';
import { Doctor } from './doctor';
import { ReservationStatus } from './enums';

export interface Reservation {
  id: number;
  doctor: Doctor;
  patient: Patient;
  appointmentTime: string; // ISO DateTime
  reason: string;
  status: ReservationStatus;
}
