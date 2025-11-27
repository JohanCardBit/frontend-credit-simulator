import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimularYsolicitar } from './simular-ysolicitar';

describe('SimularYsolicitar', () => {
  let component: SimularYsolicitar;
  let fixture: ComponentFixture<SimularYsolicitar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimularYsolicitar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimularYsolicitar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
