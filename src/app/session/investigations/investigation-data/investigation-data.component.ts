import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-investigation-data',
  templateUrl: './investigation-data.component.html',
  styleUrls: ['./investigation-data.component.css']
})
export class InvestigationDataComponent implements OnInit {
  results: string;
  resultsSubmited: boolean;

  @Input() test: any;

  constructor() { }

  ngOnInit(): void {
  }

  saveResults() {
    if (this.results !== undefined && this.results !== '') {
      console.log(this.results);
    }
  }

}
