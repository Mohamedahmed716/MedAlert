import { ReservationStatus } from './enums';

export interface Reservation {
  id: number;
  patientName: string;
  appointmentTime: string; // ISO DateTime
  reason: string;
  status: ReservationStatus;
}
