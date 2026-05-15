import { TestBed } from '@angular/core/testing';

import { dashboardService } from './dashboard';

describe('Dashboard', () => {
  let service: dashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(dashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
