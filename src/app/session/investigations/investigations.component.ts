import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators, NgForm, FormArray } from '@angular/forms';
import { APIService } from '../../services/api/api.service';
import { Notes } from '../../models/notes';
import { Investigations } from '../../models/investigation';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-investigations',
  templateUrl: './investigations.component.html',
  styleUrls: ['./investigations.component.css']
})
export class InvestigationsComponent implements OnInit {
  sessionID: number;
  fetchDataError: HttpErrorResponse;
  formGroup: FormGroup;
  formGroupSubmitted: boolean;
  edit: boolean;
  investigationRequestSuggestions: Array<string>;
  // investigationResultsSuggestions: Array<string>;
  user: User;
  investigationType: string;
  buttonEnabled = true;
  investigations = [];
  requestCompleted: boolean;
  investigationData: Investigations;
  requestNotes = [];
  test: any;
  // resultsEntry: string
  // resultsNotesCopy: Notes;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private apiservice: APIService,
    private fb: FormBuilder,
    private config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.user = this.apiservice.getUser();
    this.route.queryParams.subscribe(params => {
      if (params.sessionID !== undefined && params.sessionID !== null) {
        this.sessionID = params.sessionID;
        this.spinner.show();
        this.apiservice.getSessionInvestigations(this.sessionID).subscribe(results => {
          this.spinner.hide();
          this.investigationData = results;
          console.log(this.investigationData);
          if (this.investigationData.request.length <=0) {
            this.requestCompleted = false
          } else {
            this.requestCompleted = true
            this.requestNotes = this.investigationData.request;
            this.test = this.requestNotes[0];
            // this.initComplaintsForm();
          }
        }, (error: HttpErrorResponse) => {
          this.spinner.hide();
          if(error.status === 404) {
            this.requestCompleted = false;
          } else {
            this.fetchDataError = error;
          }
          console.log(error);
        });
      }
    });
    
    this.apiservice.getInvestigationsRequestSuggestions().subscribe(results => {
      this.investigationRequestSuggestions = results;
    });
    // this.apiservice.getInvestigationsResultsSuggestions().subscribe(results => {
    //   this.investigationResultsSuggestions = results;
    // })
  }

  // initComplaintsForm() {
  //   this.formGroupSubmitted = false;
  //   this.formGroup = this.fb.group({
  //     results: this.fb.array([])
  //   })

  //   for (const test of this.requestNotes) {
  //     this.results.push(this.fb.control('',Validators.required))
  //   }
  // }

  // submitForm(form: FormGroup, test: any, index: number) {
  //   this.formGroupSubmitted = true;
  //   console.log(form.value);
  //   this.test = test
  //   const testValue = form.value.results[index];
  //   if (testValue !== undefined && testValue !== '') {
  //     this.uploadData(testValue);
  //   }
  // }

  // uploadData(testValue: string) {
  //   const data = {
  //     entry1: testValue
  //   }

  //   this.spinner.show();
  //   if (this.edit) {
  //     this.apiservice.updateSessionInvestigationResults(this.test.results.id, data).subscribe(results => {
  //       this.spinner.hide();
  //       this.test.results = results;
  //       this.edit = false;
  //     }, error => {
  //       this.spinner.hide();
  //       this.fetchDataError = error;
  //       this.edit = false;
  //     });
  //   } else {
  //     this.apiservice.createSessionInvestigationResults(this.test.id, data).subscribe(results => {
  //       this.spinner.hide();
  //       this.investigationData = results;
  //     }, error => {
  //       this.spinner.hide();
  //       this.fetchDataError = error;
  //       console.log(this.fetchDataError);
  //     });
  //   }
  // }

  // Edit(test: any, index: number) {
  //   this.formGroup = this.fb.group({
  //     entry1: [test.results.entry1, Validators.required],
  //   });
  //   this.formGroupSubmitted = false;
  //   this.test = test
  //   this.edit = true;
  // }

  // cancelEditor() {
  //   this.edit = false;
  // }

  // navToNext() {
  //   this.router.navigate(['../diagnosis'], {
  //     queryParams: {
  //       sessionID: this.sessionID
  //     },
  //     relativeTo: this.route
  //   });
  // }

  investigationTypeInputFocus() {
    this.buttonEnabled = true;
    this.investigationType = '';
  }

  addInvestigation() {
    if (this.investigationType !== '' && this.investigationType !== null) {
      this.investigations.push(this.investigationType);
      this.buttonEnabled = false;
      this.investigationType = '';
    }
  }

  removeItem(entry: string) {
    const index = this.investigations.indexOf(entry);
    if (index > -1) {
        this.investigations.splice(index, 1);
    }
  }

  suspendSessionPrompt(content: any) {
    this.config.size = 'lg';
    const testNotes = [];
    for (const entry of this.investigations) {
      const notes: Notes = {
        entry1: entry
      }
      testNotes.push(notes);
    }
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
      this.spinner.show();
      this.apiservice.createSessionInvestigations(this.sessionID,testNotes).subscribe(results => {
        this.spinner.hide();
        this.investigationData = results;
        this.requestNotes = this.investigationData.request;
        this.requestCompleted = true;
        const updateData = {
          status: 'Suspended'
        };
        // this.initComplaintsForm();
        this.apiservice.updateSessionDetails(this.sessionID, updateData).subscribe(results => {
          this.apiservice.setSession$(results);
        }, error => {
          this.spinner.hide();
          this.fetchDataError = error;
          console.log(this.fetchDataError);
        });
      }, error => {
        this.spinner.hide();
        this.fetchDataError = error;
        console.log(this.fetchDataError);
      });
    }, () => {
      this.spinner.show();
      this.apiservice.createSessionInvestigations(this.sessionID,testNotes).subscribe(results => {
        this.spinner.hide();
        this.investigationData = results;
        this.requestNotes = this.investigationData.request;
        this.requestCompleted = true;
        // this.initComplaintsForm();
      }, error => {
        this.spinner.hide();
        this.fetchDataError = error;
        console.log(this.fetchDataError);
      });
    });
  }

  closeModal(promptResults: boolean, modal: any) {
    if (promptResults === true) {
      modal.close();
    } else {
      modal.dismiss();
    }
  }

  setTest(test: any) {
    this.test = test;
    console.log(test);
  }

  // get data1() { return this.formGroup.get('entry1'); }


}
