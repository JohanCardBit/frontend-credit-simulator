import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasosSimulador } from './pasos-simulador';

describe('PasosSimulador', () => {
  let component: PasosSimulador;
  let fixture: ComponentFixture<PasosSimulador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasosSimulador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasosSimulador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
