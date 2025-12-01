import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErBedManagementComponent } from './er-beds';

describe('ErBedManagementComponent', () => {
  let component: ErBedManagementComponent;
  let fixture: ComponentFixture<ErBedManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErBedManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErBedManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
