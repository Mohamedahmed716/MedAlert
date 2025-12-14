export interface Patient {
  id: number;
  name: string;
  condition: string;
  dateOfBirth?: string;
  lastVisit?: string;
}
