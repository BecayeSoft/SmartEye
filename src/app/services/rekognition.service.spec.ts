import { TestBed } from '@angular/core/testing';

import { RekognitionService } from './rekognition.service';

describe('RekognitionService', () => {
  let service: RekognitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RekognitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
