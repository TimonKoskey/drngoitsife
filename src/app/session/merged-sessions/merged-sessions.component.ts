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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiservice: APIService
  ) { }

  ngOnInit(): void {
    this.apiservice.checkForOpenFollowUp().subscribe(results => {
      console.log(results);
      if (results.length===0) {
        this.openFollowUpAppointmentListAvailable = false;
        this.getPreviousMergedSession(this.session);
      } else {
        this.openFollowUpAppointmentListAvailable = true;
        this.sessionsList = results;
      }
    }, error => {
      this.fetchDataError = error;
      console.error(this.fetchDataError);
    });
  }

  getPreviousMergedSession(session: Session) {
    this.apiservice.getPreviousMergedSession(session.id).subscribe(results => {
      console.log(results);
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

}
