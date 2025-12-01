import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationCenterComponent } from './notification';

describe('Notification', () => {
  let component: NotificationCenterComponent;
  let fixture: ComponentFixture<NotificationCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationCenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationCenterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
