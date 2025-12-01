import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsDepartmentComponent } from './doctors-departments';

describe('DoctorsDepartments', () => {
  let component: DoctorsDepartmentComponent;
  let fixture: ComponentFixture<DoctorsDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorsDepartmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorsDepartmentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
