import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  //Mock Data
  private userSource = new BehaviorSubject<any>({
    name: 'Dr. Emily Carter',
    role: 'Cardiologist',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwqIGtOWOnFrJqp3CqvZpNT4UXoiw80UoCEOOZwIX9a7H0L0Vsaq9tQ8bil-yUTzfk_CoSDDdYXz6woongwO9D94QiKnugVhjtlBdzq8FhvdK5H19Gm5QeoknrgGIMU0PZ0_xeJnpk-2mFYHL69y-shVOm2f8q3DV7mi4OeGnK-dRXdPiB-2ZHzGFk5E1n-FcxlecFuJvBXMg9_v1CjgsoaoyaXShetVeqDMfGBRrou_kJ0-PnYHnziO1yyUs-cYHSBzdfvjgVz_k',
    email: 'emily.carter@medalert.com',
    phone: '+1 (555) 123-4567',
    address: '123 Heartbeat Lane, Healthy City, HC 12345'
  });

  currentUser$ = this.userSource.asObservable();

  constructor() { }
}
