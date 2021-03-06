import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../services/api/api.service';
import { Session } from '../models/session';
import { NgbModal, NgbModalConfig, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import { User } from '../models/user';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit, OnDestroy {
  session: Session;
  user: User;
  fetchDataError: HttpErrorResponse;
  followUpDate: NgbDate;
  minFollowUpDate: any;
  dateEditing: boolean;
  sessionHistoryExists: boolean;
  sessionHistory: Array<Session> = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private apiservice: APIService,
    private config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.user = this.apiservice.getUser();
    this.minDate();
    this.route.queryParams.subscribe(params => {
      const sessionID = params.sessionID;
      if (sessionID !== undefined && sessionID !== null) {
        this.spinner.show();
        this.apiservice.getSessionDetails(sessionID).subscribe(results => {
          this.spinner.hide();
          this.session = results
          this.apiservice.setSession(this.session);
          this.getSessionHistory();
        }, error => {
          this.spinner.hide();
          this.fetchDataError = error;

        });
      }
    });

    this.apiservice.getSession$().subscribe(session => {
      if (session !== null) {
        this.session = session;
      }
    })
  }

  minDate() {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = (date.getMonth() + 1);
    const dateToday = date.getDate();

    this.minFollowUpDate = {
      year: currentYear,
      month: currentMonth,
      day: dateToday
    };
  }

  startSession() {
    this.spinner.show();
    this.apiservice.startNewSession(this.session.patient.id).subscribe(results => {
      this.spinner.hide();
      this.apiservice.setSession(results);
      this.router.navigate(['../session'], {
        queryParams: {
          sessionID: results.id
        },
        relativeTo: this.route
      });
    }, error => {
      this.spinner.hide();
      this.fetchDataError = error
    });
  }

  open(content: any, dateEditing: boolean) {
    this.dateEditing = dateEditing;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
      this.updateSession();
    }, () => {});
  }

  updateSession() {
    const updateData = {};

    if (!this.dateEditing) {
      updateData['status'] = 'Closed';
    }

    if (this.followUpDate !== undefined) {
      updateData['followUpDate'] = new Date(this.followUpDate.year, this.followUpDate.month - 1, this.followUpDate.day).toUTCString();
      updateData['followUpStatus'] = 'Open'
    }

    this.spinner.show();
    this.apiservice.updateSessionDetails(this.session.id, updateData).subscribe(results => {
      this.spinner.hide();
      this.session = results;
      if (!this.dateEditing) {
        this.router.navigate(['../active-sessions'], {relativeTo: this.route});
      } else {
        this.apiservice.setSession(this.session);
      }
    }, error => {
      this.spinner.hide();
      this.fetchDataError = error
    });
  }

  onDateSelect(event: any) {
    this.followUpDate = event;
  }

  deleteSession(content: any) {
    if (this.user.is_superuser) {
      this.config.size = 'lg';
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
        this.spinner.show();
        this.apiservice.deleteSession(this.session.id).subscribe(() => {
          this.spinner.hide();
          this.goToDetails();
        }, error => {
          this.spinner.hide();
          this.fetchDataError = error;

        });
      }, () => {});
    }
  }

  goToDetails() {
    this.router.navigate(['../patient-details'], {
      queryParams: {
        id: this.session.patient.id
      },
      relativeTo: this.route
    });
  }

  activateSession() {
    const updateData = {
      status: 'Active'
    };
    this.apiservice.updateSessionDetails(this.session.id, updateData).subscribe(results => {
      this.session = results;
    }, error => {
      this.spinner.hide();
      this.fetchDataError = error;
    });
  }

  cancelSession() {
    const updateData = {
      status: 'Cancelled'
    };
    this.apiservice.updateSessionDetails(this.session.id, updateData).subscribe(results => {
      this.session = results;
    }, error => {
      this.spinner.hide();
      this.fetchDataError = error;
    });
  }

  getSessionHistory() {
    this.apiservice.getPatientSessionHistory(this.session.patient.id).subscribe(results => {
      if (results.length === 0) {
        this.sessionHistoryExists = false;
      } else {
        this.sessionHistoryExists = true;
        this.sessionHistory = results;
        this.sessionHistory.reverse();
      }
    }, error => {
      console.error(error);
    });
  }

  navToSessionDetails(session: Session) {
    if (session.id !== this.session.id) {
      this.router.navigate(['../session'], {
        queryParams: {
          sessionID: session.id
        },
        relativeTo: this.route
      });
    }
  }

  ngOnDestroy() {
    this.apiservice.removeSession();
  }

}
