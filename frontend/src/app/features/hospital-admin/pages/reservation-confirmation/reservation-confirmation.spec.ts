import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationAcceptedComponent } from './reservation-confirmation';

describe('ReservationConfirmation', () => {
  let component: ReservationAcceptedComponent;
  let fixture: ComponentFixture<ReservationAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationAcceptedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationAcceptedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
