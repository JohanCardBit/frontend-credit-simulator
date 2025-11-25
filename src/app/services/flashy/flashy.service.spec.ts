import { TestBed } from '@angular/core/testing';

import { FlashyService } from './flashy.service';

describe('FlashyService', () => {
  let service: FlashyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlashyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
