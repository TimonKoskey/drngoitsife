import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from '../../services/api/api.service';
import { Notes } from '../../models/notes';
import { Investigations } from '../../models/investigation';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  // sectionCompleted: boolean;
  edit: boolean;
  // notes: Notes;
  // notesCopy: Notes;
  investigationRequestSuggestions: Array<string>;
  investigationResultsSuggestions: Array<string>;
  user: User;
  investigationType: string;
  buttonEnabled = true;
  investigations = [];
  requestCompleted: boolean;
  resultsCompleted: boolean;
  investigationData: Investigations;
  requestNotes: Notes;
  resultsNotes: Notes;
  resultsNotesCopy: Notes;


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
          if (this.investigationData.request === null) {
            this.requestCompleted = false
          } else {
            this.requestCompleted = true
            this.requestNotes = this.investigationData.request;
          }
          if (this.investigationData.results === null) {
            this.initComplaintsForm();
            this.resultsCompleted = false
          } else {
            this.resultsCompleted = true;
            this.resultsNotes = this.investigationData.results
          }
          console.log(this.investigationData);
        }, (error: HttpErrorResponse) => {
          this.spinner.hide();
          if(error.status === 404) {
            this.requestCompleted = false;
            this.resultsCompleted = false;
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
    this.apiservice.getInvestigationsResultsSuggestions().subscribe(results => {
      this.investigationResultsSuggestions = results;
    })
  }

  initComplaintsForm() {
    this.formGroupSubmitted = false;
    this.formGroup = this.fb.group({
      entry1: [this.resultsNotes !== undefined ? this.resultsNotes.entry1 : '', Validators.required],
      entry2: [this.resultsNotes !== undefined ? this.resultsNotes.entry2 : ''],
      entry3: [this.resultsNotes !== undefined ? this.resultsNotes.entry3 : ''],
      entry4: [this.resultsNotes !== undefined ? this.resultsNotes.entry4 : ''],
      entry5: [this.resultsNotes !== undefined ? this.resultsNotes.entry5 : ''],
      entry6: [this.resultsNotes !== undefined ? this.resultsNotes.entry6 : ''],
      entry7: [this.resultsNotes !== undefined ? this.resultsNotes.entry7 : '']
    });

    // this.formGroup.get('entry1').valueChanges.subscribe(value => {
    //   if(value !== '') {
    //     this.investigationResultsSuggestions = ;
    //   }
    // });

    // this.formGroup.get('entry2').valueChanges.subscribe(value => {
    //   if(value !== '') {
    //     this.investigationResultsSuggestions = this.apiservice.getInvestigationsResultsSuggestions(value);
    //   }
    // });

    // this.formGroup.get('entry3').valueChanges.subscribe(value => {
    //   if(value !== '') {
    //     this.investigationResultsSuggestions = this.apiservice.getInvestigationsResultsSuggestions(value);
    //   }
    // });

    // this.formGroup.get('entry4').valueChanges.subscribe(value => {
    //   if(value !== '') {
    //     this.investigationResultsSuggestions = this.apiservice.getInvestigationsResultsSuggestions(value);
    //   }
    // });

    // this.formGroup.get('entry5').valueChanges.subscribe(value => {
    //   if(value !== '') {
    //     this.investigationResultsSuggestions = this.apiservice.getInvestigationsResultsSuggestions(value);
    //   }
    // });

    // this.formGroup.get('entry6').valueChanges.subscribe(value => {
    //   if(value !== '') {
    //     this.investigationResultsSuggestions = this.apiservice.getInvestigationsResultsSuggestions(value);
    //   }
    // });

    // this.formGroup.get('entry7').valueChanges.subscribe(value => {
    //   if(value !== '') {
    //     this.investigationResultsSuggestions = this.apiservice.getInvestigationsResultsSuggestions(value);
    //   }
    // });
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
      this.apiservice.updateSessionInvestigationResults(this.investigationData.results.id,formData).subscribe(results => {
        this.spinner.hide();
        this.resultsNotes = results;
        this.investigationData.results = results;
        this.edit = false;
      }, error => {
        this.spinner.hide();
        this.resultsNotes = this.resultsNotesCopy;
        this.fetchDataError = error;
        this.edit = false;
      });
    } else {
      this.apiservice.createSessionInvestigationResults(this.investigationData.id,formData).subscribe(results => {
        this.spinner.hide();
        this.investigationData = results;
        this.resultsCompleted = true;
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
    this.resultsNotesCopy = this.resultsNotes;
    this.initComplaintsForm();
  }

  cancelEditor() {
    this.resultsNotes = this.resultsNotesCopy;
    this.edit = false;
  }

  navToNext() {
    this.router.navigate(['../diagnosis'], {
      queryParams: {
        sessionID: this.sessionID
      },
      relativeTo: this.route
    });
  }

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
    // return this.payments;
  }

  suspendSessionPrompt(content: any) {
    this.config.size = 'lg';
    this.requestNotes = {}
    for (const entry of this.investigations) {
      if (this.requestNotes.entry1 === undefined) {
        this.requestNotes.entry1 = entry
      } else if (this.requestNotes.entry2 === undefined) {
        this.requestNotes.entry2 = entry
      } else if (this.requestNotes.entry3 === undefined) {
        this.requestNotes.entry3 = entry
      } else if (this.requestNotes.entry4 === undefined) {
        this.requestNotes.entry4 = entry
      } else if (this.requestNotes.entry5 === undefined) {
        this.requestNotes.entry5 = entry
      } else if (this.requestNotes.entry6 === undefined) {
        this.requestNotes.entry6 = entry
      } else if (this.requestNotes.entry7 === undefined) {
        this.requestNotes.entry7 = entry
      }
    }
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
      this.spinner.show();
      this.apiservice.createSessionInvestigations(this.sessionID,this.requestNotes).subscribe(results => {
        this.spinner.hide();
        this.investigationData = results;
        this.initComplaintsForm();
        this.requestCompleted = true;
        const updateData = {
          status: 'Suspended'
        };
        this.apiservice.updateSessionDetails(this.sessionID, updateData).subscribe(results => {
          console.log(results);
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
      this.apiservice.createSessionInvestigations(this.sessionID,this.requestNotes).subscribe(results => {
        this.spinner.hide();
        this.investigationData = results;
        this.initComplaintsForm();
        this.requestCompleted = true;
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

  get data1() { return this.formGroup.get('entry1'); }

}
