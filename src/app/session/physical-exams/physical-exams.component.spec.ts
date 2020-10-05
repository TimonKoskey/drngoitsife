import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalExamsComponent } from './physical-exams.component';

describe('PhysicalExamsComponent', () => {
  let component: PhysicalExamsComponent;
  let fixture: ComponentFixture<PhysicalExamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalExamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
