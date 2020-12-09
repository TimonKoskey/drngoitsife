import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationDataComponent } from './investigation-data.component';

describe('InvestigationDataComponent', () => {
  let component: InvestigationDataComponent;
  let fixture: ComponentFixture<InvestigationDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestigationDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
