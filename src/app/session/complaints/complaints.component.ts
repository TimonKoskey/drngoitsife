import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from '../../services/api/api.service';
import { Notes } from '../../models/notes';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Component({
  selector: 'app-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnInit {
  sessionID: number;
  fetchDataError: HttpErrorResponse;
  complaintsFormGroup: FormGroup;
  complaintsFormGroupSubmitted: boolean;
  complaintsSectionCompleted: boolean;
  editComplaints: boolean;
  complaints: Notes;
  complaintsCopy: Notes;
  suggestions: Observable<string>;
  user: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private apiservice: APIService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.user = this.apiservice.getUser();
    this.route.queryParams.subscribe(params => {
      if (params.sessionID !== undefined && params.sessionID !== null) {
        this.sessionID = params.sessionID;
        this.spinner.show();
        this.apiservice.getSessionComplaints(this.sessionID).subscribe(results => {
          this.spinner.hide();
          this.complaints = results;
          this.complaintsSectionCompleted = true;
        }, (error: HttpErrorResponse) => {
          this.spinner.hide();
          if(error.status === 404) {
            this.complaintsSectionCompleted = false;
            this.initComplaintsForm();
          } else {
            this.fetchDataError = error;
          }
          console.log(error);
        });
      }
    });

    // this.suggestions = this.apiservice.getComplaintsSuggestions()
  }

  initComplaintsForm() {
    this.complaintsFormGroupSubmitted = false;
    this.complaintsFormGroup = this.fb.group({
      entry1: [this.complaints !== undefined ? this.complaints.entry1 : '', Validators.required],
      entry2: [this.complaints !== undefined ? this.complaints.entry2 : ''],
      entry3: [this.complaints !== undefined ? this.complaints.entry3 : ''],
      entry4: [this.complaints !== undefined ? this.complaints.entry4 : ''],
      entry5: [this.complaints !== undefined ? this.complaints.entry5 : ''],
      entry6: [this.complaints !== undefined ? this.complaints.entry6 : ''],
      entry7: [this.complaints !== undefined ? this.complaints.entry7 : '']
    });

    this.complaintsFormGroup.get('entry1').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getComplaintsSuggestions(value);
      }
    });

    this.complaintsFormGroup.get('entry2').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getComplaintsSuggestions(value);
      }
    });

    this.complaintsFormGroup.get('entry3').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getComplaintsSuggestions(value);
      }
    });

    this.complaintsFormGroup.get('entry4').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getComplaintsSuggestions(value);
      }
    });

    this.complaintsFormGroup.get('entry5').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getComplaintsSuggestions(value);
      }
    });

    this.complaintsFormGroup.get('entry6').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getComplaintsSuggestions(value);
      }
    });

    this.complaintsFormGroup.get('entry7').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getComplaintsSuggestions(value);
      }
    });
  }

  submitForm() {
    this.complaintsFormGroupSubmitted = true;
    if (this.complaintsFormGroup.valid) {
      this.spinner.show();
      this.uploadComplaints();
    }
  }

  uploadComplaints() {
    const formData: Notes = this.complaintsFormGroup.value;
    this.spinner.show();
    if (this.editComplaints) {
      this.apiservice.updateSessionComplaintsDetails(this.complaints.id,formData).subscribe(results => {
        this.spinner.hide();
        this.complaints = results;
        this.editComplaints = false;
      }, error => {
        this.spinner.hide();
        this.complaints = this.complaintsCopy;
        this.fetchDataError = error;
        this.editComplaints = false;
      });
    } else {
      this.apiservice.createSessionComplaints(this.sessionID,formData).subscribe(results => {
        this.spinner.hide();
        this.complaints = results;
        this.complaintsSectionCompleted = true;
        this.navToNext();
      }, error => {
        this.spinner.hide();
        this.fetchDataError = error;
        console.log(this.fetchDataError);
      });
    }
  }

  EditComplaints() {
    this.editComplaints = true;
    this.complaintsCopy = this.complaints;
    this.initComplaintsForm();
  }

  cancelEditor() {
    this.complaints = this.complaintsCopy;
    this.editComplaints = false;
  }

  navToNext() {
    this.router.navigate(['../physical-exam'], {
      queryParams: {
        sessionID: this.sessionID
      },
      relativeTo: this.route
    });
  }

  get data1() { return this.complaintsFormGroup.get('entry1'); }

}
