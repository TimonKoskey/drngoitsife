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
  user: User;
  investigationType: string;
  buttonEnabled = true;
  investigations = [];
  requestCompleted: boolean;
  investigationData: Investigations;
  requestNotes = [];
  test: any;
  index: number;

  results = "";
  resultsSubmited: boolean;
  editResults = false;

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
            this.index = 0;
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
  }

  suspendSessionPrompt(content: any) {
    this.config.size = 'lg';
    const testNotes = [];
    for (const entry of this.investigations) {
      const notes = {
        test: entry
      }
      testNotes.push(notes);
    }
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(() => {
      this.spinner.show();
      this.apiservice.createSessionInvestigations(this.sessionID,testNotes).subscribe(results => {
        this.spinner.hide();
        this.investigationData = results;
        this.requestNotes = this.investigationData.request;
        this.test = this.requestNotes[0];
        this.index = 0;
        this.requestCompleted = true;
        const updateData = {
          status: 'Suspended'
        };
        this.apiservice.updateSessionDetails(this.sessionID, updateData).subscribe(results => {
          this.apiservice.setSession$(results);
        }, error => {
          this.spinner.hide();
          this.fetchDataError = error;
        });
        this.toActiveList();
      }, error => {
        this.spinner.hide();
        this.fetchDataError = error;
      });
    }, () => {
      this.spinner.show();
      this.apiservice.createSessionInvestigations(this.sessionID,testNotes).subscribe(results => {
        this.spinner.hide();
        this.investigationData = results;
        this.requestNotes = this.investigationData.request;
        this.test = this.requestNotes[0];
        this.index = 0;
        this.requestCompleted = true;
        this.toActiveList();
      }, error => {
        this.spinner.hide();
        this.fetchDataError = error;
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

  setTest(test: any, index: number) {
    this.test = test;
    this.index = index;
    this.results = "";
    this.editResults = false;
  }

  testUpdate(test: any) {
    this.test = test;
    this.requestNotes[this.index] = test;
  }

  saveResults() {
    this.resultsSubmited = true;
    if (this.results !== undefined && this.results !== '') {
      const testData = {
        results: this.results
      }

      this.apiservice.updateSessionInvestigationRequest(this.test.id, testData).subscribe(results => {
        this.test = results;
        this.testUpdate(this.test);
        this.results = '';
        this.editResults = false;
      });
    }
  }

  Edit() {
    this.results = this.test.results
    this.editResults = true;
  }

  cancelEditor() {
    this.results = '';
    this.editResults = false;
  }

  toActiveList() {
    this.router.navigate(['../active-sessions'], {relativeTo: this.route.parent});
  }


}
