import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrieveSessionComponent } from './retrieve-session.component';

describe('RetrieveSessionComponent', () => {
  let component: RetrieveSessionComponent;
  let fixture: ComponentFixture<RetrieveSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrieveSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrieveSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
