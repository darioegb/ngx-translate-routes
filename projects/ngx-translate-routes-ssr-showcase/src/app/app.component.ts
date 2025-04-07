import { isPlatformBrowser } from '@angular/common'
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink, RouterOutlet } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ngx-translate-routes-ssr-showcase'
  idUser = 1
  languages = [
    {
      key: 'English',
      value: 'en',
    },
    {
      key: 'Spanish',
      value: 'es',
    },
  ]
  language!: string
  private readonly translate = inject(TranslateService)
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID))

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
}
