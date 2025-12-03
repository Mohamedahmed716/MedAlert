import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErReservationsComponent } from './er-reservations';

describe('ErReservations', () => {
  let component: ErReservationsComponent;
  let fixture: ComponentFixture<ErReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErReservationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErReservationsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
