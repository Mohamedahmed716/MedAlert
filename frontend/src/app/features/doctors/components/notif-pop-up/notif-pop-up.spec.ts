import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifPopUp } from './notif-pop-up';

describe('NotifPopUp', () => {
  let component: NotifPopUp;
  let fixture: ComponentFixture<NotifPopUp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotifPopUp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotifPopUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
