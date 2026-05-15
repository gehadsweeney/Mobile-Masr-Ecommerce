import { TestBed } from '@angular/core/testing';

import { CategoryServices } from './category-services';

describe('CategoryServices', () => {
  let service: CategoryServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
