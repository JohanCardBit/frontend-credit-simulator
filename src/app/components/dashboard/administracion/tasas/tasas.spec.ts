import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tasas } from './tasas';

describe('Tasas', () => {
  let component: Tasas;
  let fixture: ComponentFixture<Tasas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tasas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tasas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
