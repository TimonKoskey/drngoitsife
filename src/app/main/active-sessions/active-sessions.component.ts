import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../../services/api/api.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Session } from '../../models/session';

@Component({
  selector: 'app-active-sessions',
  templateUrl: './active-sessions.component.html',
  styleUrls: ['./active-sessions.component.css']
})
export class ActiveSessionsComponent implements OnInit, OnDestroy {
  recordsAvailable: boolean;
  sessionsList: Array<Session> = [];
  mainSessionsList: Array<Session> = [];
  paginatedSessionList: Array<Session> = [];
  is_filtering = false;
  poll: any;
  currentPaginationPage: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private apiservice: APIService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.getActiveSessions();

    this.poll = setInterval(() => {
      if (!this.is_filtering) {
        this.getActiveSessions();
      } 
    }, 30000);
  }

  getActiveSessions() {
    this.apiservice.getActiveSessions().subscribe(results => {
      this.spinner.hide();
      if (results.length === 0) {
        this.recordsAvailable = false;
      } else {
        this.recordsAvailable = true;
        this.sessionsList = results.reverse();
        this.mainSessionsList = results.reverse();
        this.paginatedSessionList = this.sessionsList.slice(0, 30);
      }
    }, error => {
      this.spinner.hide();
      console.error(error);
    });
  }

  onKey(event: any) {
    const searchTerm = event.target.value;
    if (searchTerm !== '' || searchTerm !== undefined) {
      this.is_filtering = true;
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
      this.paginatedSessionList = this.sessionsList.slice(0, 30);
    } else {
      this.sessionsList = this.mainSessionsList;
      this.paginatedSessionList = this.sessionsList.slice(0, 30);
      this.is_filtering = false;
    }
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.paginatedSessionList = this.sessionsList.slice(startItem, endItem);
    this.currentPaginationPage = event.page;
  }

  getItemCount(index: number) {
    let itemCount = index + 1;
    if (this.currentPaginationPage > 1) {
      itemCount = (30 * (this.currentPaginationPage - 1)) + (index + 1);
    }
    return itemCount;
  }


  navToSessionDetails(session: Session) {
    this.router.navigate(['../session'], {
      queryParams: {
        sessionID: session.id
      },
      relativeTo: this.route
    });
  }

  ngOnDestroy() {
    if (this.poll) {
      clearInterval(this.poll);
    }
  }

}
