import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhototabComponent } from './phototab.component';

describe('PhototabComponent', () => {
  let component: PhototabComponent;
  let fixture: ComponentFixture<PhototabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhototabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhototabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
