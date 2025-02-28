import { Injectable, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { firstValueFrom } from 'rxjs'
import { NGX_TRANSLATE_ROUTES_CONFING } from './ngx-translate-routes.token'

@Injectable({
  providedIn: 'root',
})
export class NgxTranslateRoutesTitleService {
  private readonly translate = inject(TranslateService)
  private readonly title = inject(Title)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly config = inject(NGX_TRANSLATE_ROUTES_CONFING)

  async translateTitle(): Promise<void> {
    let child = this.activatedRoute.firstChild
    while (child?.firstChild) {
      child = child.firstChild
    }
    const { title: routeTitle, skipTranslation } = child?.snapshot.data || {}
    const params = child?.snapshot.params
    let appTitle: string

    if (skipTranslation) {
      appTitle = routeTitle
    } else if (routeTitle) {
      appTitle = await firstValueFrom(
        this.translate.get(`${this.config.titlePrefix}.${routeTitle}`, params),
      )
    } else {
      appTitle = this.title.getTitle()
    }
    this.title.setTitle(appTitle)
  }
}
