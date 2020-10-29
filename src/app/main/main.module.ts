import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { MainRoutingModule } from './main-routing.module';
import { SessionModule } from '../session/session.module';

import { APIService } from '../services/api/api.service';

import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { PatientRecordsComponent } from './patient-records/patient-records.component';
import { RegisterPatientFormComponent } from './register-patient-form/register-patient-form.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { ActiveSessionsComponent } from './active-sessions/active-sessions.component';
import { FollowUpComponent } from './follow-up/follow-up.component';
import { RetrieveSessionComponent } from './retrieve-session/retrieve-session.component';
import { CashReportComponent } from './cash-report/cash-report.component';
import { LabResultsListComponent } from './lab-results-list/lab-results-list.component';

@NgModule({

  declarations: [
    MainComponent,
    HomeComponent,
    PatientRecordsComponent,
    RegisterPatientFormComponent,
    PatientDetailsComponent,
    ActiveSessionsComponent,
    FollowUpComponent,
    RetrieveSessionComponent,
    CashReportComponent,
    LabResultsListComponent
  ],

  imports: [
    CommonModule,
    MainRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgbDatepickerModule,
    PaginationModule.forRoot(),
    TypeaheadModule.forRoot(),
    SessionModule
  ],

  providers: [ APIService ]
})
export class MainModule { }
