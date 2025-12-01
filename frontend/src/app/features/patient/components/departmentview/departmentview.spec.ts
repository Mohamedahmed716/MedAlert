import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Departmentview } from './departmentview';

describe('Departmentview', () => {
  let component: Departmentview;
  let fixture: ComponentFixture<Departmentview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Departmentview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Departmentview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
