import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErAlertComponent } from './er-alert';

describe('ErAlertComponent', () => {
  let component: ErAlertComponent;
  let fixture: ComponentFixture<ErAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErAlertComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
