import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxTranslateRoutesConfig } from './ngx-translate-routes-config';
import { NgxTranslateRoutesService } from './ngx-translate-routes.service';
import { NGX_TRANSLATE_ROUTES_CONFING } from './ngx-translate-routes.token';

@NgModule({
  imports: [CommonModule, TranslateModule],
  providers: [TitleCasePipe]
})
export class NgxTranslateRoutesModule {
  constructor(private translateRoutesService: NgxTranslateRoutesService) {
    this.translateRoutesService.init();
  }
  static forRoot(
    config?: NgxTranslateRoutesConfig
  ): ModuleWithProviders<NgxTranslateRoutesModule> {
    return {
      ngModule: NgxTranslateRoutesModule,
      providers: [{ provide: NGX_TRANSLATE_ROUTES_CONFING, useValue: {
        enableRouteTranslate:
          config?.enableRouteTranslate !== undefined
            ? config.enableRouteTranslate
            : true,
        enableTitleTranslate:
          config?.enableTitleTranslate !== undefined
            ? config.enableTitleTranslate
            : true,
      } }],
    };
  }
}
