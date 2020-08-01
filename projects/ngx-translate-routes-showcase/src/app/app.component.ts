import { Component, OnInit } from '@angular/core';
import { NgxTranslateRoutesService } from 'projects/ngx-translate-routes/src/public-api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angulartitle';
  idUser = 1;
  languajes = [
    {
      key: 'English',
      value: 'en'
    },
    {
      key: 'Spanish',
      value: 'es'
    }
  ];
  languaje: string;

  constructor(
    private translate: TranslateService,
    private translateRoutesService: NgxTranslateRoutesService
  ) {}

  ngOnInit() {
    this.translateRoutesService.translateTitles();
    this.translateRoutesService.translateRoutes();
  }

  changeLanguaje() {
    this.translate.setDefaultLang(this.languaje);
  }
}
