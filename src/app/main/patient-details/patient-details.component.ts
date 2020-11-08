import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../../services/api/api.service';
import { Patient } from '../../models/patient';
import { Session } from '../../models/session';
import { User } from '../../models/user';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  user: User;
  patient: Patient;
  patientCopy: Patient;
  sessionHistoryExists: boolean;
  sessionHistory: Array<Session> = [];
  editPatientDetails = false
  editPatientDetailsFormSubmitted: boolean;
  completeStartNewSessionAction: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private apiservice: APIService,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'lg';
  }

  ngOnInit(): void {
    this.user = this.apiservice.getUser();
    this.spinner.show();
    this.route.queryParams.subscribe(params => {
      const patientID = params.id;
      this.apiservice.getPatientDetails(patientID).subscribe(results => {
        this.patient = results;
        this.getSessionHistory();
      }, error => {
        this.spinner.hide();
        console.error(error);
      });
    });
  }

  getSessionHistory() {
    this.apiservice.getPatientSessionHistory(this.patient.id).subscribe(results => {
      this.spinner.hide();
      if (results.length === 0) {
        this.sessionHistoryExists = false;
      } else {
        this.sessionHistoryExists = true;
        this.sessionHistory = results;
        this.sessionHistory.reverse();
      }
    }, error => {
      this.spinner.hide();
      console.error(error);
    });
  }

  checkForSuspendedSession(content: any) {
    this.spinner.show();
    this.apiservice.checkForSuspendedSessions(this.patient.id).subscribe(results => {
      if (results.length === 0) {
        this.startSession();
      } else {
        this.spinner.hide();
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
          if (this.completeStartNewSessionAction) {
            this.spinner.show();
            this.startSession();
          } else {
            this.router.navigate(['../lab-results'], { relativeTo: this.route });
          }
        }, () => {});
      }
    }, error => {
      this.spinner.hide();
      console.error(error); 
    })
  }

  startSession() {
    this.apiservice.startNewSession(this.patient.id).subscribe(results => {
      this.spinner.hide();
      this.navToSessionDetails(results);
    }, error => {
      this.spinner.hide();
      console.error(error);
    });
  }

  EditPatientDetails() {
    this.patientCopy = this.patient;
    this.editPatientDetails = true;
  }

  cancelEdit() {
    this.patient = this.patientCopy;
    this.editPatientDetails = false;
  }

  submitData(formData: NgForm) {
    this.editPatientDetailsFormSubmitted = true;
    if (formData.valid) {
      this.spinner.show();
      this.patient = formData.value;
      this.patient.id = this.patientCopy.id;
      this.patient['dob'] = new Date(formData.value['dateOfBirth']).toUTCString();
      this.apiservice.updatePatientDetails(this.patient).subscribe(results => {
        this.spinner.hide();
        this.patient = results;
        this.editPatientDetails = false
        this.editPatientDetailsFormSubmitted = false;
      }, error => {
        this.spinner.hide();
        this.patient = this.patientCopy;
        this.editPatientDetails = false
        this.editPatientDetailsFormSubmitted = false;
        console.error(error);
      });
    }
  }

  navToSessionDetails(session: Session) {
    this.router.navigate(['../session'], {
      queryParams: {
        sessionID: session.id
      },
      relativeTo: this.route
    });
  }

  deletePatient(content: any) {
    if (this.user.is_superuser) {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
        this.apiservice.deletePatientDetails(this.patient.id).subscribe(() => {
          this.router.navigate(['../patient-records'], { relativeTo: this.route });
        }, error => {
          this.spinner.hide();
          console.error(error);
        })
      }, () => {});
    }
  }

  suspendedSessionNotifClose(proceed: boolean, modal: any) {
    this.completeStartNewSessionAction = proceed;
    modal.close();
  }

}
