import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hospitaldashboard } from './hospitaldashboard';

describe('Hospitaldashboard', () => {
  let component: Hospitaldashboard;
  let fixture: ComponentFixture<Hospitaldashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hospitaldashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hospitaldashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
