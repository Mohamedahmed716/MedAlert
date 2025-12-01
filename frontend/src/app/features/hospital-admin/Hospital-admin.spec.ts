import { TestBed } from '@angular/core/testing';
import { HospitalAdmin } from './Hospital-Admin';

describe('HospitalAdmin', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HospitalAdmin],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(HospitalAdmin);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(HospitalAdmin);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, ver2');
  });
});
