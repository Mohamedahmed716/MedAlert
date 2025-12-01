import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Findhospital } from './findhospital';

describe('Findhospital', () => {
  let component: Findhospital;
  let fixture: ComponentFixture<Findhospital>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Findhospital]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Findhospital);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
