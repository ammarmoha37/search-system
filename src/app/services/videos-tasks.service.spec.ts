import { TestBed } from '@angular/core/testing';

import { VideosTasksService } from './videos-tasks.service';

describe('VideosResearchersService', () => {
  let service: VideosTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideosTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
