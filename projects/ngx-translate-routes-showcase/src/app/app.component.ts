import { Component, OnInit, inject } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'angulartitle'
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

  ngOnInit(): void {
    const lang = localStorage.getItem('lang')
    this.language = lang ? lang : this.translate.defaultLang
    this.translate.use(this.language)
  }

  changeLanguage() {
    this.translate.use(this.language)
    localStorage.setItem('lang', this.language)
  }
}
