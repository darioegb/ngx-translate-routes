import { TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
  withXhr,
} from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { provideRouter } from '@angular/router'
import { httpLoaderFactory } from './app.config'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        TranslateModule.forRoot({
          defaultLanguage: 'en',
          useDefaultLang: true,
          loader: {
            provide: TranslateLoader,
            useFactory: httpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      providers: [
        provideRouter([]),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
      ],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    expect(fixture.componentInstance).toBeTruthy()
  })

  it('should render the brand and the navigation links', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector('.navbar-brand')?.textContent).toContain(
      'ngx-translate-routes',
    )
    expect(compiled.querySelectorAll('.list-group-item')).toHaveLength(5)
  })

  it('should persist the selected language', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    app.language = 'es'
    app.changeLanguage()
    expect(localStorage.getItem('lang')).toBe('es')
  })
})
