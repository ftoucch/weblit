import { TestBed } from '@angular/core/testing';

import { ResearchService } from './research.service';

describe('ResearchService', () => {
  let service: ResearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
