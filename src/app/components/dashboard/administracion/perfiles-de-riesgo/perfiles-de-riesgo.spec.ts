import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilesDeRiesgo } from './perfiles-de-riesgo';

describe('PerfilesDeRiesgo', () => {
  let component: PerfilesDeRiesgo;
  let fixture: ComponentFixture<PerfilesDeRiesgo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilesDeRiesgo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilesDeRiesgo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
