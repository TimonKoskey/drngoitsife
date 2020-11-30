import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { APIService } from '../../services/api/api.service';
import { Patient } from '../../models/patient';

@Component({
  selector: 'app-patient-records',
  templateUrl: './patient-records.component.html',
  styleUrls: ['./patient-records.component.css']
})
export class PatientRecordsComponent implements OnInit, OnDestroy {
  recordsAvailable: boolean;
  patientsList: Array<Patient> = [];
  mainPatientsList: Array<Patient> = [];
  paginatedPatientList: Array<Patient> = []
  currentPaginationPage: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private apiservice: APIService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.fetchPatientsList();
  }

  fetchPatientsList() {
    this.apiservice.getPatientRecordsFromBE().subscribe(results => {
      if (results.length === 0) {
        this.spinner.hide();
        this.recordsAvailable = false;
      } else {
        this.recordsAvailable = true;
        this.patientsList = results.reverse();
        this.mainPatientsList = results.reverse();
        this.paginatedPatientList = this.patientsList.slice(0, 30);
      }
    }, error => {
      this.spinner.hide();
      console.error(error);
    });
  }

  onKey(event: any) {
    const searchTerm = event.target.value;
    if (searchTerm !== '' || searchTerm !== undefined) {
      const searchTermLower = searchTerm.toLowerCase();
      const newPatientsList = [];
      console.log(searchTermLower)
      for (const patient of this.mainPatientsList) {
        const mainPhoneNumber = patient.mainPhoneNumber;
        const firstName = patient.firstName.toLowerCase();
        const middleName = patient.middleName.toLowerCase();
        const surname = patient.surname.toLowerCase();

        if (surname.includes(searchTermLower)  || firstName.includes(searchTermLower) ||  middleName.includes(searchTermLower) ||
          mainPhoneNumber.includes(searchTermLower)) {
            newPatientsList.push(patient);
        }
      }
      this.patientsList = newPatientsList;
      this.paginatedPatientList = this.patientsList.slice(0, 30);
    } else {
      this.patientsList = this.mainPatientsList;
      this.paginatedPatientList = this.patientsList.slice(0, 30);
    }
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.paginatedPatientList = this.patientsList.slice(startItem, endItem);
    this.currentPaginationPage = event.page;
  }

  getItemCount(index: number) {
    let itemCount = index + 1;
    if (this.currentPaginationPage > 1) {
      itemCount = (30 * (this.currentPaginationPage - 1)) + (index + 1);
    }
    return itemCount;
  }

  goToDetails(patient: Patient) {
    this.router.navigate(['../patient-details'], {
      queryParams: {
        id: patient.id
      },
      relativeTo: this.route
    });
  }

  ngOnDestroy() {

  }

}
