import { User } from './auth.models';

export interface Notification {
  id: number;
  recipient: User;
  title: string;
  message: string;
  timestamp: string; // LocalDateTime -> string
  isRead: boolean;
}
