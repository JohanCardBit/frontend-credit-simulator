import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelUser } from './panel-user';

describe('PanelUser', () => {
  let component: PanelUser;
  let fixture: ComponentFixture<PanelUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
