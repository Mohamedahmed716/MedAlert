import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reservationconfirmation } from './reservationconfirmation';

describe('Reservationconfirmation', () => {
  let component: Reservationconfirmation;
  let fixture: ComponentFixture<Reservationconfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reservationconfirmation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reservationconfirmation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
