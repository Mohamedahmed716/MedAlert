import { TestBed } from '@angular/core/testing';
import { Hospital_admin } from './hospital_admin';

describe('Hospital_admin', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hospital_admin],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Hospital_admin);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(Hospital_admin);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, ver2');
  });
});
