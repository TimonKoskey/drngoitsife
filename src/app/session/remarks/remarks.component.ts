import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from '../../services/api/api.service';
import { Notes } from '../../models/notes';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.css']
})
export class RemarksComponent implements OnInit {
  sessionID: number;
  fetchDataError: HttpErrorResponse;
  formGroup: FormGroup;
  formGroupSubmitted: boolean;
  sectionCompleted: boolean;
  edit: boolean;
  notes: Notes;
  notesCopy: Notes;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private apiservice: APIService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.sessionID !== undefined && params.sessionID !== null) {
        this.sessionID = params.sessionID;
        this.spinner.show();
        this.apiservice.getSessionRemarks(this.sessionID).subscribe(results => {
          this.spinner.hide();
          this.notes = results;
          this.sectionCompleted = true;
        }, (error: HttpErrorResponse) => {
          this.spinner.hide();
          if(error.status === 404) {
            this.sectionCompleted = false;
            this.initComplaintsForm();
          } else {
            this.fetchDataError = error;
          }
          console.log(error);
        });
      }
    });
  }

  initComplaintsForm() {
    this.formGroupSubmitted = false;
    this.formGroup = this.fb.group({
      entry1: [this.notes !== undefined ? this.notes.entry1 : '', Validators.required],
      entry2: [this.notes !== undefined ? this.notes.entry2 : ''],
      entry3: [this.notes !== undefined ? this.notes.entry3 : ''],
      entry4: [this.notes !== undefined ? this.notes.entry4 : ''],
      entry5: [this.notes !== undefined ? this.notes.entry5 : ''],
      entry6: [this.notes !== undefined ? this.notes.entry6 : ''],
      entry7: [this.notes !== undefined ? this.notes.entry7 : '']
    });
  }

  submitForm() {
    this.formGroupSubmitted = true;
    if (this.formGroup.valid) {
      this.spinner.show();
      this.uploadData();
    }
  }

  uploadData() {
    const formData: Notes = this.formGroup.value;
    this.spinner.show();
    if (this.edit) {
      this.apiservice.updateSessionRemarks(this.notes.id,formData).subscribe(results => {
        this.spinner.hide();
        this.notes = results;
        this.edit = false;
      }, error => {
        this.spinner.hide();
        this.notes = this.notesCopy;
        this.fetchDataError = error;
        this.edit = false;
      });
    } else {
      this.apiservice.createSessionRemarks(this.sessionID,formData).subscribe(results => {
        this.spinner.hide();
        this.notes = results;
        this.sectionCompleted = true;
        // this.navToNext();
      }, error => {
        this.spinner.hide();
        this.fetchDataError = error;
        console.log(this.fetchDataError);
      });
    }
  }

  Edit() {
    this.edit = true;
    this.notesCopy = this.notes;
    this.initComplaintsForm();
  }

  cancelEditor() {
    this.notes = this.notesCopy;
    this.edit = false;
  }

  // navToNext() {
  //   this.router.navigate(['../investigations'], {
  //     queryParams: {
  //       sessionID: this.sessionID
  //     },
  //     relativeTo: this.route
  //   });
  // }

  get data1() { return this.formGroup.get('entry1'); }

}
