import {
  NgModule,
  ModuleWithProviders,
  SkipSelf,
  Optional,
  inject,
} from '@angular/core'
import { CommonModule, TitleCasePipe } from '@angular/common'
import { TranslateModule } from '@ngx-translate/core'
import { NgxTranslateRoutesService } from './ngx-translate-routes.service'
import { NGX_TRANSLATE_ROUTES_CONFIG } from './ngx-translate-routes.token'
import { NgxTranslateRoutesConfig } from './ngx-translate-routes.interfaces'

@NgModule({
  imports: [CommonModule, TranslateModule.forChild()],
  providers: [TitleCasePipe],
})
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
          useValue: {
            enableRouteTranslate: config?.enableRouteTranslate ?? true,
            enableTitleTranslate: config?.enableTitleTranslate ?? true,
            enableQueryParamsTranslate: config?.enableQueryParamsTranslate,
            routePrefix: config?.routePrefix ?? 'routes',
            routeSuffixesWithQueryParams:
              config?.routeSuffixesWithQueryParams ?? {
                route: 'root',
                params: 'params',
              },
            routesUsingStrategy: config?.routesUsingStrategy ?? [],
            titlePrefix: config?.titlePrefix ?? 'titles',
            onLanguageChange: config?.onLanguageChange ?? undefined,
            routeTranslationStrategy:
              config?.routeTranslationStrategy ?? undefined,
            cacheMethod: config?.cacheMethod ?? 'localStorage',
            cookieExpirationDays: config?.cookieExpirationDays ?? 30,
          },
        },
      ],
    }
  }
}
