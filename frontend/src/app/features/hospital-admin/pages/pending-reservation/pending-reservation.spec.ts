import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingReservationDetailComponent } from './pending-reservation';

describe('PendingReservation', () => {
  let component: PendingReservationDetailComponent;
  let fixture: ComponentFixture<PendingReservationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingReservationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingReservationDetailComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
