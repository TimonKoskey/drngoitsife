import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { APIService } from '../../services/api/api.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiservice: APIService,
  ) { }

  ngOnInit() {
    this.user = this.apiservice.getUser();
  }

  navToPatientRecords() {
    this.router.navigate(['../patient-records'], { relativeTo: this.route });
  }

  navToPatientRegistration() {
    this.router.navigate(['../register-patient'], { relativeTo: this.route });
  }

  navToActiveSessions() {
    this.router.navigate(['../active-sessions'], { relativeTo: this.route });
  }

  navToRetrieveSession() {
    this.router.navigate(['../retrieve-session'], { relativeTo: this.route });
  }

  navToFollowUpSessions() {
    this.router.navigate(['../follow-up-sessions'], { relativeTo: this.route });
  }

  navToSysAdmin() {
    this.router.navigate(['../system-administration'], { relativeTo: this.route });
  }

}
