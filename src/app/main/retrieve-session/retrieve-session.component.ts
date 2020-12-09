import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../../services/api/api.service';
import { Session } from '../../models/session';
import { NgbModal, NgbModalConfig, NgbDate} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-retrieve-session',
  templateUrl: './retrieve-session.component.html',
  styleUrls: ['./retrieve-session.component.css']
})
export class RetrieveSessionComponent implements OnInit {
  recordsAvailable: boolean;
  queryString: string;
  retrievedSessions:Array<Session> = [];
  ngbDate: NgbDate;
  dateTime: Date;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private apiservice: APIService,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }

  // startSearch() {
  //   if (this.queryString !== '' && this.queryString !== undefined) {
  //     console.log(this.queryString);
  //   }
  // }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
      if (this.ngbDate !== undefined) {
        this.dateTime = new Date(this.ngbDate.year, this.ngbDate.month - 1, this.ngbDate.day);
        this.dateTime.setHours(23,59.59,0)
        this.retrieveSessionByDate();
      }
    }, () => {});
  }

  retrieveSessionByDate() {
    const dateTimeString = this.dateTime.toUTCString();
    this.spinner.show();
    this.apiservice.getSessionByDate(dateTimeString).subscribe(results => {
      this.spinner.hide();
      if (results.length === 0) {
        this.recordsAvailable = false;
      } else {
        this.recordsAvailable = true;
        this.retrievedSessions = results;
      }
    }, error => {
      this.spinner.hide();
      console.error(error);
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

  onDateSelect(event: any) {
    this.ngbDate = event;
  }

}
