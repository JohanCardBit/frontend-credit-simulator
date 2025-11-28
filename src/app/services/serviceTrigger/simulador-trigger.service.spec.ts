import { TestBed } from '@angular/core/testing';

import { SimuladorTriggerService } from './simulador-trigger.service';

describe('SimuladorTriggerService', () => {
  let service: SimuladorTriggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimuladorTriggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
