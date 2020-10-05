import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../../services/api/api.service';
import { Session } from '../../models/session';
import { NgbModal, NgbModalConfig} from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Payment } from '../../models/payment';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  sessionID: number;
  payments: Payment[] = [];
  selectedPaymentInformation: Payment;
  fetchDataError: HttpErrorResponse
  modalFormSubmited: boolean;
  dataAvailable: boolean;

  InsuranceProviders: string[] = ['NPS', 'Kengen', 'APA', 'Britam', 'Jubilee', 'AON', 'CIC', 'Sedgwick', 'Takaful', 'G.A', 'KPLC', 'KRA', 'KPC',
    'NHIF (Comprehensive)', 'NHIF (NPS)', 'Resolution', 'UAP', 'UOE', 'MADISON', 'AAR', 'Co-operative Bank', 'Liaison', 'Sanlam',
    'Heritage', 'First Insurance', 'HFCK', 'Saham', 'Kenindia', 'KCB', 'Pacis', 'Kenya Alliance', 'Cigna' ];

  concepts: string[] = ['Flexible Pharyngoscopy', 'Consultation', 'Ear Syringing', 'Nasal Packaging', 'Ear Wax Removal', 'Foreign Body Nose Removal',
    'Foreign Body Ear Removal', 'Foreign Body Throat Removal', 'Neck Ultrasound', 'Tissue Biopsy Under Local Anesthesia'];


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
    config.size = 'lg';
    config.centered = true;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.sessionID !== undefined && params.sessionID !== null) {
        this.sessionID = params.sessionID;
        this.spinner.show();
        this.apiservice.getSessionPaymentsList(this.sessionID).subscribe(results => {
          this.spinner.hide();
          if (results.length === 0) {
            this.dataAvailable = false;
          } else {
            this.dataAvailable = true;
            this.payments = results
          }
        }, error => {
          this.spinner.hide();
          this.fetchDataError = error;
          console.log(this.fetchDataError);
        });
      }
    });
  }

  paymentFormSubmit(paymentForm: NgForm, modal: any) {
    this.modalFormSubmited = true;
    if (paymentForm.valid) {
      this.selectedPaymentInformation = paymentForm.value
      this.spinner.show();
      modal.close();
    }
  }

  openPaymentDetails(content: any, paymentInfo: Payment) {
    this.selectedPaymentInformation = paymentInfo;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(result => {
      this.openEdit(result, paymentInfo);
    }, () => { });
  }

  openAdd(content: any) {
    this.selectedPaymentInformation = {};
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => {
      this.newPaymentInformation();
    }, () => {
      this.selectedPaymentInformation = null;
      this.modalFormSubmited = null;
    });
  }

  openEdit(content: any, paymentInfo: Payment) {
    this.selectedPaymentInformation = {};
    this.selectedPaymentInformation.concept = paymentInfo.concept;
    this.selectedPaymentInformation.method = paymentInfo.method;
    this.selectedPaymentInformation.amount = paymentInfo.amount;
    this.selectedPaymentInformation.balance = paymentInfo.balance;
    this.selectedPaymentInformation.companyName = paymentInfo.companyName;
    this.selectedPaymentInformation.description = paymentInfo.description;
    this.selectedPaymentInformation.mpesaCode = paymentInfo.mpesaCode;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => {
      this.editPaymentInformation(paymentInfo);
    }, () => {
      this.selectedPaymentInformation = null;
      this.modalFormSubmited = null;
    });
  }

  newPaymentInformation() {
    this.apiservice.createPaymentInformation(this.sessionID, this.selectedPaymentInformation).subscribe(results => {
      this.spinner.hide();
      this.payments.push(results);
      this.dataAvailable = true;
    }, error => {
      this.spinner.hide();
      this.fetchDataError = error;
      console.error(this.fetchDataError);
      
    });
  }

  editPaymentInformation(paymentInfo: Payment) {
    this.apiservice.updateSessionPaymentDetails(paymentInfo.id, this.selectedPaymentInformation).subscribe(results => {
      this.spinner.hide();
      console.log(results)
      this.arrayRemoveItem(paymentInfo);
      this.payments.push(results);
    }, error => {
      this.spinner.hide();
      this.fetchDataError = error;
      console.error(this.fetchDataError);
      
    });
  }

  deletePayment(payment: Payment) {
    this.spinner.show();
    this.apiservice.deleteSessionPaymentDetails(payment.id).subscribe(() => {
      this.spinner.hide();
      this.arrayRemoveItem(payment);
      if (this.payments.length === 0) {
        this.dataAvailable = false;
      }
    }, error => {
      this.spinner.hide();
      this.fetchDataError = error;
      console.error(this.fetchDataError);    
    });
  }

  arrayRemoveItem(paymentInfo: Payment) {
    const index = this.payments.indexOf(paymentInfo);
    if (index > -1) {
        this.payments.splice(index, 1);
    }
    // return this.payments;
  }

}
