import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../../services/api/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cash-report',
  templateUrl: './cash-report.component.html',
  styleUrls: ['./cash-report.component.css']
})
export class CashReportComponent implements OnInit {
  reportGenerated = false;
  cashReport: any;
  dateToday = new Date();
  minDateString: string;
  fetchDataError: HttpErrorResponse;
  dateFrom: string;
  dateTo: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private apiservice: APIService
  ) { }

  ngOnInit(): void {
    this.minDate();
  }

  minDate() {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = (date.getMonth() + 1);
    const dateToday = date.getDate();

    this.minDateString = `${currentYear.toString()}-${currentMonth.toString()}-${dateToday.toString()}`;
  }

  todayCashReport() {
    const minDateTime = new Date();
    minDateTime.setHours(0,0,0,0);
    const maxDateTime = new Date();

    const timeRange = {
      min: minDateTime.toUTCString(),
      max: maxDateTime.toUTCString()
    }

    this.getCashReport(timeRange);
  }

  sevenDayCashReport() {
    const minDateTime = new Date();
    minDateTime.setDate(this.dateToday.getDate() - 7);
    minDateTime.setHours(0,0,0,0);
    const maxDateTime = new Date()

    const timeRange = {
      min: minDateTime.toUTCString(),
      max: maxDateTime.toUTCString()
    }
    this.getCashReport(timeRange);
  }

  thirtyDayCashReport() {
    const minDateTime = new Date();
    minDateTime.setDate(this.dateToday.getDate() - 30);
    minDateTime.setHours(0,0,0,0);
    const maxDateTime = new Date();

    const timeRange = {
      min: minDateTime.toUTCString(),
      max: maxDateTime.toUTCString()
    }
    this.getCashReport(timeRange);
  }

  getCashReport(timeRange: any) {
    this.spinner.show();
    this.apiservice.getCashReport(timeRange).subscribe(results => {
      this.spinner.hide();
      this.cashReport = results;
      this.reportGenerated = true;
    }, error => {
      this.spinner.hide();
      this.fetchDataError = error;
    });
  }

  dateInputSubmit() {
    const minDateTime = new Date(this.dateFrom);
    const maxDateTime = new Date(this.dateTo);

    if (minDateTime.toString() !== 'Invalid Date' && maxDateTime.toString() !== 'Invalid Date') {
      minDateTime.setHours(0,0,0,0);
      maxDateTime.setHours(23,59,59,0);

      const timeRange = {
        min: minDateTime.toUTCString(),
        max: maxDateTime.toUTCString()
      }

      this.getCashReport(timeRange);
    }

  }

}
