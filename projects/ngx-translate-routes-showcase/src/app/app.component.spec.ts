import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { AppComponent } from './app.component'
import { httpLoaderFactory } from './app.module'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs'

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [AppComponent],
    imports: [RouterModule.forRoot([]),
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            useDefaultLang: true,
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        FormsModule],
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
    ]
}).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
    localStorage.clear()
    fixture.detectChanges()
  })

  it('should create the app', () => {
    expect(component).toBeTruthy()
  })

  it('private readonly ngOnInit should set default lang', () => {
    component.ngOnInit()
    expect(component.language).toBeDefined()
  })

  it('private readonly changeLanguaje should to change the current lang', () => {
    const lang = localStorage.getItem('lang')
    component.language = 'es'
    component.changeLanguage()
    expect(lang).not.toEqual(localStorage.getItem('lang'))
    component.ngOnInit()
    expect(component.language).toBeDefined()
  })
})
