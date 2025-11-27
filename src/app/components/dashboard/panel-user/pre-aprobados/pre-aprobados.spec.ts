import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAprobados } from './pre-aprobados';

describe('PreAprobados', () => {
  let component: PreAprobados;
  let fixture: ComponentFixture<PreAprobados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreAprobados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreAprobados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
