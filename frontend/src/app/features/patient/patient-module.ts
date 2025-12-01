import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Patient} from './patients';
import { PatientRoutingModule } from './patient-routing-module';
import { FormsModule } from '@angular/forms'; 
import { Myprescriptions } from './components/myprescriptions/myprescriptions';
import { MyReservations } from './components/myreservations/myreservations';

@NgModule({

  imports: [CommonModule, PatientRoutingModule,Patient,FormsModule,Myprescriptions,MyReservations],
})
export class PatientModule {}
