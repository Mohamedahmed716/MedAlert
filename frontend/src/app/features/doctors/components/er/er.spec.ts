import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Er } from './er';

describe('Er', () => {
  let component: Er;
  let fixture: ComponentFixture<Er>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Er]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Er);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
