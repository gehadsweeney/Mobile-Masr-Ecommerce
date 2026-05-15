import { TestBed } from '@angular/core/testing';

import { BrandServices } from './brand-services';

describe('BrandServices', () => {
  let service: BrandServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
