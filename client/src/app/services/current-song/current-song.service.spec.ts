import { TestBed } from '@angular/core/testing';

import { CurrentSongService } from './current-song.service';

describe('CurrentSongService', () => {
  let service: CurrentSongService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentSongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
