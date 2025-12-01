import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hospitaldepartments } from './hospitaldepartments';

describe('Hospitaldepartments', () => {
  let component: Hospitaldepartments;
  let fixture: ComponentFixture<Hospitaldepartments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hospitaldepartments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hospitaldepartments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
