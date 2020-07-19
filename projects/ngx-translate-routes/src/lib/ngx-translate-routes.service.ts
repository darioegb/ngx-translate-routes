import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NgxTranslateRoutesService {

  constructor(
    private translate: TranslateService
  ) {

  }

}
