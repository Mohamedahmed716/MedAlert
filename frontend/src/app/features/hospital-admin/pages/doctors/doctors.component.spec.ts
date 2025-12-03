import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorListComponent } from './doctors.component';

describe('DoctorsComponent', () => {
  let component: DoctorListComponent;
  let fixture: ComponentFixture<DoctorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
