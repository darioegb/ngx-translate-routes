import { TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { httpLoaderFactory } from './app.config'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs'

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
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: {
              paramMap: {
                get: () => 'en',
              },
            },
          },
        },
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it(`should have the 'ngx-translate-routes-ssr-showcase' title`, () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app.title).toEqual('ngx-translate-routes-ssr-showcase')
  })

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Welcome to ngx-translate-routes-ssr-showcase!',
    )
  })
})
