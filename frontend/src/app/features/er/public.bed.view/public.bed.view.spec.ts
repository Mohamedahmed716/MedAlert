import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicBedView } from './public.bed.view';

describe('PublicBedView', () => {
  let component: PublicBedView;
  let fixture: ComponentFixture<PublicBedView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicBedView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicBedView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
