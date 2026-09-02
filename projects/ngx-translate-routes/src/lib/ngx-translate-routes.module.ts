import {
  NgModule,
  ModuleWithProviders,
  SkipSelf,
  Optional,
  inject,
} from '@angular/core'
import { NgxTranslateRoutesService } from './ngx-translate-routes.service'
import { NGX_TRANSLATE_ROUTES_CONFIG } from './ngx-translate-routes.token'
import { NgxTranslateRoutesConfig } from './ngx-translate-routes.interfaces'
import { DEFAULT_CONFIG } from './ngx-translate-routes.constants'

/** @deprecated Use `provideNgxTranslateRoutes()` instead. Will be removed in a future major version. */
@NgModule()
export class NgxTranslateRoutesModule {
  private readonly translateRoutesService = inject(NgxTranslateRoutesService)

  constructor(@Optional() @SkipSelf() parentModule?: NgxTranslateRoutesModule) {
    if (parentModule) {
      throw new Error(
        'NgxTranslateRoutesModule is already loaded. Import it in the AppModule only',
      )
    }
    this.translateRoutesService.init()
  }

  static forRoot(
    config?: NgxTranslateRoutesConfig,
  ): ModuleWithProviders<NgxTranslateRoutesModule> {
    return {
      ngModule: NgxTranslateRoutesModule,
      providers: [
        {
          provide: NGX_TRANSLATE_ROUTES_CONFIG,
          useValue: { ...DEFAULT_CONFIG, ...config },
        },
      ],
    }
  }
}
