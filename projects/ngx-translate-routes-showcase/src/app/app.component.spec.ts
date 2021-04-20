import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { httpLoaderFactory } from './app.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AppComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          defaultLanguage: 'en',
          useDefaultLang: true,
          loader: {
            provide: TranslateLoader,
            useFactory: httpLoaderFactory,
            deps: [HttpClient],
          },
        }),
        FormsModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    localStorage.clear();
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should set default lang', () => {
    component.ngOnInit();
    expect(component.languaje).toBeDefined();
  });

  it('#changeLanguaje should to change the current lang', () => {
    const lang = localStorage.getItem('lang');
    component.languaje = 'es';
    component.changeLanguaje();
    expect(lang).not.toEqual(localStorage.getItem('lang'));
    component.ngOnInit();
    expect(component.languaje).toBeDefined();
  });


});
