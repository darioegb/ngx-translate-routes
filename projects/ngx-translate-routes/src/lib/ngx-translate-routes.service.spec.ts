import { TestBed } from '@angular/core/testing';

import { NgxTranslateRoutesService } from './ngx-translate-routes.service';

describe('NgxTranslateRoutesService', () => {
  let service: NgxTranslateRoutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxTranslateRoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
