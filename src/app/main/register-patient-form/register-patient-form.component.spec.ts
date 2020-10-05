import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPatientFormComponent } from './register-patient-form.component';

describe('RegisterPatientFormComponent', () => {
  let component: RegisterPatientFormComponent;
  let fixture: ComponentFixture<RegisterPatientFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPatientFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPatientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
