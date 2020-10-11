import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergedSessionsComponent } from './merged-sessions.component';

describe('MergedSessionsComponent', () => {
  let component: MergedSessionsComponent;
  let fixture: ComponentFixture<MergedSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergedSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergedSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
