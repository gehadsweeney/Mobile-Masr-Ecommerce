import { TestBed } from '@angular/core/testing';

import { VendorServices } from './vendor-services';

describe('VendorServices', () => {
  let service: VendorServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
