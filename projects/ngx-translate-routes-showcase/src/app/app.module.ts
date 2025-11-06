import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { FormsModule } from '@angular/forms'

import { AppComponent } from './app.component'
import { AboutComponent } from './about/about.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { MyprofileComponent } from './myprofile/myprofile.component'
import { MyaccountComponent } from './myaccount/myaccount.component'
import { NgxTranslateRoutesModule } from 'projects/ngx-translate-routes/src/public-api'
import { NotFoundComponent } from './not-found/not-found.component'

export const httpLoaderFactory = (http: HttpClient) =>
  new TranslateHttpLoader(http)

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    DashboardComponent,
    MyprofileComponent,
    MyaccountComponent,
    NotFoundComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      useDefaultLang: true,
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxTranslateRoutesModule.forRoot({
      enableLanguageInPath: true,
      includeDefaultLanguageInPath: true,
    }),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}
