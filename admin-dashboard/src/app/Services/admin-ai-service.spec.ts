import { TestBed } from '@angular/core/testing';

import { AdminAIService } from './admin-ai-service';

describe('AdminAIService', () => {
  let service: AdminAIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
