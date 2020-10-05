import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../../services/api/api.service';
import { Patient } from '../../models/patient';

@Component({
  selector: 'app-register-patient-form',
  templateUrl: './register-patient-form.component.html',
  styleUrls: ['./register-patient-form.component.css']
})
export class RegisterPatientFormComponent implements OnInit {
  newPatientRecordForm: FormGroup;
  patientRecordFormSubmitted = false;
  patient: Patient;
  patientExists: boolean;
  queryString: string;
  queryResults = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private apiservice: APIService
  ) { }

  ngOnInit() {
    this.newPatientRecordForm = this.fb.group({
      patientRegistrationNumber: [],
      firstName: ['', Validators.required],
      middleName: [''],
      surname: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', Validators.required],
      mainPhoneNumber: ['', Validators.required],
      alternativePhoneNumber: [''],
      email: [''],
      county: ['', Validators.required],
      subCounty: [''],
      estateOrArea: ['', Validators.required]
    });
  }

  onSubmit() {
    this.patientRecordFormSubmitted = true;
    if (this.newPatientRecordForm.valid) {
      this.spinner.show();
      this.patient = this.newPatientRecordForm.value;
      this.patient.firstName = this.capitalizeFirstLetter(this.firstName.value);
      this.patient.middleName = this.capitalizeFirstLetter(this.middleName.value);
      this.patient.surname = this.capitalizeFirstLetter(this.surname.value);
      this.patient.gender = this.capitalizeFirstLetter(this.gender.value);
      this.patient.county = this.capitalizeFirstLetter(this.county.value);
      this.patient.subCounty = this.capitalizeFirstLetter(this.subCounty.value);
      this.patient.estateOrArea = this.capitalizeFirstLetter(this.estateOrArea.value);
      this.patient.mainPhoneNumber = this.mainPhoneNumber.value.trim().replace(/\s+/g, '');
      this.patient.alternativePhoneNumber = this.alternativePhoneNumber.value.trim().replace(/\s+/g, '');
      this.apiservice.registerNewPatientToDatabase(this.patient).subscribe(results => {
        this.spinner.hide();
        this.router.navigate(['../patient-details'], {
          queryParams: {
            id: results.id
          },
          relativeTo: this.route
        });
      }, error => {
        this.spinner.hide();
        console.error(error);
      });
    }
  }

  capitalizeFirstLetter(dataString: string) {
    return dataString.charAt(0).toUpperCase() + dataString.slice(1);
  }

  goToDetails(patient: Patient) {
    this.router.navigate(['../patient-details'], {
      queryParams: {
        id: patient.id
      },
      relativeTo: this.route
    });
  }

  backToForm() {
    this.queryResults = [];
    this.patientExists = false;
  }

  get surname() { return this.newPatientRecordForm.get('surname'); }
  get firstName() { return this.newPatientRecordForm.get('firstName'); }
  get middleName() { return this.newPatientRecordForm.get('middleName'); }
  get patientIdentification() { return this.newPatientRecordForm.get('patientRegistrationNumber'); }
  get gender() { return this.newPatientRecordForm.get('gender'); }
  get age() { return this.newPatientRecordForm.get('age'); }
  get mainPhoneNumber() { return this.newPatientRecordForm.get('mainPhoneNumber'); }
  get alternativePhoneNumber() { return this.newPatientRecordForm.get('alternativePhoneNumber'); }
  get email() { return this.newPatientRecordForm.get('email'); }
  get county() { return this.newPatientRecordForm.get('county'); }
  get subCounty() { return this.newPatientRecordForm.get('subCounty'); }
  get estateOrArea() { return this.newPatientRecordForm.get('estateOrArea'); }
  get jobTitle() { return this.newPatientRecordForm.get('jobTitle'); }

  counties = ['BARINGO','BOMET','BUNGOMA','BUSIA','ELGEYO-MARAKWET','EMBU','GARISSA','HOMA-BAY','ISIOLO','KAJIADO','KAKAMEGA','KERICHO','KIAMBU',
    'KILIFI','KIRINYAGA','KISII','KISUMU','KITUI','KWALE','LAIKIPIA','LAMU','MACHAKOS','MAKUENI','MANDERA','MARSABIT','MERU','MIGORI','MOMBASA',
    'MURANGA','NAIROBI','NAKURU','NANDI','NAROK','NYAMIRA','NYANDARUA','NYERI','SAMBURU','SIAYA','TAITA-TAVETA','TANA RIVER','THARAKA-NITHI',
    'TRANS-NZOIA','TURKANA','UASIN GISHU','VIHIGA','WAJIR','WEST POKOT'
  ];

}
