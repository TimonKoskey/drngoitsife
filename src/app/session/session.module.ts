import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { SessionRoutingModule } from './session-routing.module';
import { SessionComponent } from './session.component';
import { PaymentsComponent } from './payments/payments.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { PhysicalExamsComponent } from './physical-exams/physical-exams.component';
import { ComorbiditiesComponent } from './comorbidities/comorbidities.component';
import { InvestigationsComponent } from './investigations/investigations.component';
import { DiagnosisComponent } from './diagnosis/diagnosis.component';
import { TreatmentComponent } from './treatment/treatment.component';
import { RemarksComponent } from './remarks/remarks.component';


@NgModule({
  
  declarations: [
    SessionComponent,
    PaymentsComponent,
    ComplaintsComponent,
    PhysicalExamsComponent,
    ComorbiditiesComponent,
    InvestigationsComponent,
    DiagnosisComponent,
    TreatmentComponent,
    RemarksComponent
  ],

  imports: [
    CommonModule,
    SessionRoutingModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    NgbDatepickerModule,
    PaginationModule.forRoot(),
    TypeaheadModule.forRoot()
  ]
})
export class SessionModule { }
