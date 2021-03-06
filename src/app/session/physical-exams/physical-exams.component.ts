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
  selector: 'app-physical-exams',
  templateUrl: './physical-exams.component.html',
  styleUrls: ['./physical-exams.component.css']
})
export class PhysicalExamsComponent implements OnInit {
  sessionID: number;
  fetchDataError: HttpErrorResponse;
  formGroup: FormGroup;
  formGroupSubmitted: boolean;
  sectionCompleted: boolean;
  edit: boolean;
  notes: Notes;
  notesCopy: Notes;
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
        this.apiservice.getSessionPhycExam(this.sessionID).subscribe(results => {
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

    this.formGroup.get('entry1').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getPhysicalSuggestions(value);
      }
    });

    this.formGroup.get('entry2').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getPhysicalSuggestions(value);
      }
    });

    this.formGroup.get('entry3').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getPhysicalSuggestions(value);
      }
    });

    this.formGroup.get('entry4').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getPhysicalSuggestions(value);
      }
    });

    this.formGroup.get('entry5').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getPhysicalSuggestions(value);
      }
    });

    this.formGroup.get('entry6').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getPhysicalSuggestions(value);
      }
    });

    this.formGroup.get('entry7').valueChanges.subscribe(value => {
      if(value !== '') {
        this.suggestions = this.apiservice.getPhysicalSuggestions(value);
      }
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
      this.apiservice.updateSessionPhycExam(this.notes.id,formData).subscribe(results => {
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
      this.apiservice.createSessionPhycExam(this.sessionID,formData).subscribe(results => {
        this.spinner.hide();
        this.notes = results;
        this.sectionCompleted = true;
        this.navToNext();
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

  navToNext() {
    this.router.navigate(['../comorbidities'], {
      queryParams: {
        sessionID: this.sessionID
      },
      relativeTo: this.route
    });
  }

  get data1() { return this.formGroup.get('entry1'); }

}
