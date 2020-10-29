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
import { ComplaintsComponent } from '../session/complaints/complaints.component';
import { PhysicalExamsComponent } from '../session/physical-exams/physical-exams.component';
import { ComorbiditiesComponent } from '../session/comorbidities/comorbidities.component';
import { InvestigationsComponent } from '../session/investigations/investigations.component';
import { DiagnosisComponent } from '../session/diagnosis/diagnosis.component';
import { TreatmentComponent } from '../session/treatment/treatment.component';
import { RemarksComponent } from '../session/remarks/remarks.component';
import { CashReportComponent } from './cash-report/cash-report.component';
import { LabResultsListComponent } from './lab-results-list/lab-results-list.component';

const routes: Routes = [
  { path: 'account', component: MainComponent, children: [
    { path: '',   redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'register-patient', component: RegisterPatientFormComponent },
    { path: 'patient-records', component: PatientRecordsComponent },
    { path: 'patient-details', component: PatientDetailsComponent },
    { path: 'active-sessions', component: ActiveSessionsComponent },
    { path: 'retrieve-session', component: RetrieveSessionComponent },
    { path: 'follow-up-sessions', component: FollowUpComponent },
    { path: 'cash-report', component: CashReportComponent },
    { path: 'lab-results', component: LabResultsListComponent },

    { path: 'session', component: SessionComponent, children: [
      { path: '',   redirectTo: 'payments', pathMatch: 'full' },
      { path: 'payments', component: PaymentsComponent },
      { path: 'complaints', component: ComplaintsComponent },
      { path: 'physical-exam', component: PhysicalExamsComponent },
      { path: 'comorbidities', component: ComorbiditiesComponent },
      { path: 'investigations', component: InvestigationsComponent },
      { path: 'diagnosis', component: DiagnosisComponent },
      { path: 'treatment', component: TreatmentComponent },
      { path: 'remarks', component: RemarksComponent }
    ]}
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ ]
})
export class MainRoutingModule { }
