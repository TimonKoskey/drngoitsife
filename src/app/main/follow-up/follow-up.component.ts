import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../../services/api/api.service';
import { Session } from '../../models/session';

@Component({
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.css']
})
export class FollowUpComponent implements OnInit {
  recordsAvailable: boolean;
  sessionsList: Array<Session> = [];
  mainSessionsList: Array<Session> = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private apiservice: APIService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.apiservice.getFollowUpSessions().subscribe(results => {
      this.spinner.hide();

      if (results.length === 0) {
        this.recordsAvailable = false;
      } else {
        this.recordsAvailable = true
        this.sessionsList = results.reverse();
        this.mainSessionsList = results.reverse();
      }
    });
  }

  onKey(event: any) {
    const searchTerm = event.target.value;
    if (searchTerm !== '' || searchTerm !== undefined) {
      const searchTermLower = searchTerm.toLowerCase();
      const newSessionList = [];
      for (const session of this.mainSessionsList) {
        const firstName = session.patient.firstName.toLowerCase();
        const middleName = session.patient.middleName.toLowerCase();
        const surname = session.patient.surname.toLowerCase();
        if (surname.includes(searchTermLower)  ||
            firstName.includes(searchTermLower) || middleName.includes(searchTermLower)) {
              newSessionList.push(session);
        }
      }
      this.sessionsList = newSessionList;
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

}
