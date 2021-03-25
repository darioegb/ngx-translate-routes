import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { ENGLISH_TRANSLATIONS } from '../test';

import { NgxTranslateRoutesService } from './ngx-translate-routes.service';

describe('NgxTranslateRoutesService', () => {
  let service: NgxTranslateRoutesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateTestingModule.withTranslations('en', ENGLISH_TRANSLATIONS),
      ],
    });
    service = TestBed.inject(NgxTranslateRoutesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
