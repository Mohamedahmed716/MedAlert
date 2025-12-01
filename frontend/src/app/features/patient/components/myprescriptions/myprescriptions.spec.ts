import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Myprescriptions } from './myprescriptions';

describe('Myprescriptions', () => {
  let component: Myprescriptions;
  let fixture: ComponentFixture<Myprescriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Myprescriptions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Myprescriptions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
