import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicHospitalList } from './public.hospital.list';

describe('PublicHospitalList', () => {
  let component: PublicHospitalList;
  let fixture: ComponentFixture<PublicHospitalList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicHospitalList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicHospitalList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
