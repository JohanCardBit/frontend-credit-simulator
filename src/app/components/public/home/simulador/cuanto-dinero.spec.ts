import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuantoDinero } from './cuanto-dinero';

describe('CuantoDinero', () => {
  let component: CuantoDinero;
  let fixture: ComponentFixture<CuantoDinero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuantoDinero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuantoDinero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
