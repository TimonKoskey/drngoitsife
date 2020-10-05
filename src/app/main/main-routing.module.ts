import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { PatientRecordsComponent } from './patient-records/patient-records.component';
import { RegisterPatientFormComponent } from './register-patient-form/register-patient-form.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { ActiveSessionsComponent } from './active-sessions/active-sessions.component';
import { RetrieveSessionComponent } from './retrieve-session/retrieve-session.component';
import { FollowUpComponent } from './follow-up/follow-up.component';

import { SessionComponent } from '../session/session.component';
import { PaymentsComponent } from '../session/payments/payments.component';


const routes: Routes = [
  { path: '', component: MainComponent, children: [
    { path: '',   redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'register-patient', component: RegisterPatientFormComponent },
    { path: 'patient-records', component: PatientRecordsComponent },
    { path: 'patient-details', component: PatientDetailsComponent },
    { path: 'active-sessions', component: ActiveSessionsComponent },
    { path: 'retrieve-session', component: RetrieveSessionComponent },
    { path: 'follow-up-sessions', component: FollowUpComponent },

    { path: 'session', component: SessionComponent, children: [
      { path: '',   redirectTo: 'payments', pathMatch: 'full' },
      { path: 'payments', component: PaymentsComponent },
    ]}
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ ]
})
export class MainRoutingModule { }
