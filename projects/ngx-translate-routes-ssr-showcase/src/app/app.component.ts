import { DOCUMENT, NgTemplateOutlet, isPlatformBrowser } from '@angular/common'
import {
  Component,
  inject,
  OnInit,
  DestroyRef,
  PLATFORM_ID,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormsModule } from '@angular/forms'
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { filter } from 'rxjs'
import { ThemeService } from './theme.service'
import { reportHeightToParent } from './embed-height'
import { CodeSnippetComponent } from './code-snippet/code-snippet.component'

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    FormsModule,
    NgTemplateOutlet,
    CodeSnippetComponent,
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  idUser = 1
  languages = [
    { key: 'English', value: 'en' },
    { key: 'Spanish', value: 'es' },
  ]
  language!: string

  protected readonly links = {
    docs: 'https://darioegb.github.io/ngx-translate-routes/',
    github: 'https://github.com/darioegb/ngx-translate-routes',
    npm: 'https://www.npmjs.com/package/ngx-translate-routes',
  }
  protected readonly currentPath = signal('')
  protected readonly currentTitle = signal('')

  private readonly translate = inject(TranslateService)
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID))
  private readonly themeService = inject(ThemeService)
  private readonly router = inject(Router)
  private readonly document = inject(DOCUMENT)
  protected readonly embedded = this.themeService.embedded
  protected readonly theme = this.themeService.theme

  constructor() {
    if (this.isBrowser && this.embedded) {
      inject(DestroyRef).onDestroy(reportHeightToParent(this.document))
    }
    if (this.isBrowser) {
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          takeUntilDestroyed(),
        )
        .subscribe(() => this.trackLocation())
      // Language change re-translates the current URL + title without navigating.
      this.translate.onLangChange
        .pipe(takeUntilDestroyed())
        .subscribe(() => this.trackLocation())
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const lang = localStorage.getItem('lang')
      this.language = lang ? lang : this.translate.defaultLang
      this.translate.use(this.language)
    } else {
      this.translate.use(this.translate.defaultLang)
    }
  }

  changeLanguage(): void {
    this.translate.use(this.language)
    if (this.isBrowser) {
      localStorage.setItem('lang', this.language)
    }
  }

  protected toggleTheme(): void {
    this.themeService.toggle()
  }

  // ngx-translate-routes rewrites the URL + title after navigation, so read on a microtask.
  private trackLocation(): void {
    setTimeout(() => {
      this.currentPath.set(this.document.location.pathname)
      this.currentTitle.set(this.document.title)
    })
  }
}
