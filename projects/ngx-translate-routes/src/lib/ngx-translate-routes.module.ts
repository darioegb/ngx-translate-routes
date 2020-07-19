import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxTranslateRoutesService } from './ngx-translate-routes.service';


@NgModule({
  declarations: [
    NgxTranslateRoutesService
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    NgxTranslateRoutesService
  ]
})
export class NgxTranslateRoutesModule { }
