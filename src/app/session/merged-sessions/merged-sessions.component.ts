import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from '../../services/api/api.service';
import { Session, MergedSessions } from '../../models/session';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-merged-sessions',
  templateUrl: './merged-sessions.component.html',
  styleUrls: ['./merged-sessions.component.css']
})
export class MergedSessionsComponent implements OnInit {
  @Input() session: Session;
  fetchDataError: HttpErrorResponse;
  openFollowUpAppointmentListAvailable: boolean;
  mergedSessionAvailable: boolean;
  sessionsList: Array<Session>;
  is_prev_available = true;
  is_next_available = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiservice: APIService
  ) { }

  ngOnInit(): void {
    this.getFollowUpSessions();
  }

  getFollowUpSessions() {
    this.apiservice.checkForOpenFollowUp(this.session.patient.id).subscribe(results => {
      if (results.length===0) {
        this.openFollowUpAppointmentListAvailable = false; 
        this.getPreviousMergedSession(this.session);
      } else {
        this.openFollowUpAppointmentListAvailable = true;
        this.mergedSessionAvailable = false
        this.sessionsList = results;
      }
    }, error => {
      this.fetchDataError = error;
      console.error(this.fetchDataError);
    });
  }

  getPreviousMergedSession(session: Session) {
    this.apiservice.getPreviousMergedSession(session.id).subscribe(results => {
      if (results.length===0) {
        this.mergedSessionAvailable = false;
      } else {
        this.mergedSessionAvailable = true;
        this.sessionsList = results;
      }
    }, error => {
      this.fetchDataError = error;
      console.error(this.fetchDataError);
    });
  }

  getPreviousSession(session: Session) {
    this.apiservice.getPreviousMergedSession(session.id).subscribe(results => {
      if (results.length !== 0) {
        this.is_prev_available = true;
        this.is_next_available = true;
        this.sessionsList = results;
      } else {
        this.is_prev_available = false;
      }
    }, error => {
      this.fetchDataError = error;
      console.error(this.fetchDataError);
    });
  }

  getNextSession(session: Session) {
    this.apiservice.getNextMergedSession(session.id).subscribe(results => {
      if (results.length !== 0) {
        if (results[0].id === this.session.id) {
          this.is_next_available = false;
        } else {
          this.is_next_available = true;
          this.is_prev_available = true;
          this.sessionsList = results;
        }
      } else {
        this.is_next_available = false;
      }
    }, error => {
      this.fetchDataError = error;
      console.error(this.fetchDataError);
    });
  }

  cancelFollowUp(session: Session) {
    const updateData = {
      followUpStatus: 'Cancelled'
    }
    this.apiservice.updateSessionDetails(session.id, updateData).subscribe(results => {
      console.log(results);
      this.getFollowUpSessions();
    }, error => {
      this.fetchDataError = error;
      console.error(this.fetchDataError);
    });
  }

  mergeSessions(session: Session) {
    const mergedSessions: MergedSessions = {
      previous: session,
      next: this.session
    }
    this.apiservice.mergeSessions(mergedSessions).subscribe(results => {
      console.log(results);
      this.getFollowUpSessions();
    }, error => {
      this.fetchDataError = error;
      console.error(this.fetchDataError);
    });
  }

  navToSessionDetails(session: Session) {
    this.router.navigate(['../session'], {
      queryParams: {
        sessionID: session.id
      },
      relativeTo: this.route
    });
  }

}
