import { Injectable, inject, Inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { firstValueFrom } from 'rxjs'
import { NgxTranslateRoutesConfig } from './ngx-translate-routes.interfaces'
import { NGX_TRANSLATE_ROUTES_CONFING } from './ngx-translate-routes.token'

@Injectable({
  providedIn: 'root',
})
export class NgxTranslateRoutesTitleService {
  #translate = inject(TranslateService)
  #title = inject(Title)
  #activatedRoute = inject(ActivatedRoute)

  constructor(
    @Inject(NGX_TRANSLATE_ROUTES_CONFING)
    private config: NgxTranslateRoutesConfig,
  ) {}

  async translateTitle(): Promise<void> {
    let child = this.#activatedRoute.firstChild
    while (child?.firstChild) {
      child = child.firstChild
    }
    const routeTitle = child?.snapshot.data?.title
    const skipTranslation = !!child?.snapshot.data?.skipTranslation
    const params = child?.snapshot.params
    let appTitle: string
    if (skipTranslation) {
      appTitle = routeTitle
    } else if (routeTitle) {
      appTitle = await firstValueFrom(
        this.#translate.get(`${this.config.titlePrefix}.${routeTitle}`, params),
      )
    } else {
      appTitle = this.#title.getTitle()
    }
    this.#title.setTitle(appTitle)
  }
}
