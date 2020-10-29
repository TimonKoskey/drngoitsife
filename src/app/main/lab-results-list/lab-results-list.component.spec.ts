import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabResultsListComponent } from './lab-results-list.component';

describe('LabResultsListComponent', () => {
  let component: LabResultsListComponent;
  let fixture: ComponentFixture<LabResultsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabResultsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabResultsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
