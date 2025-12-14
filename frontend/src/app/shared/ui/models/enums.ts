export enum Role {
  ADMIN = 'ADMIN',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN' // Based on your SQL query example
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}
