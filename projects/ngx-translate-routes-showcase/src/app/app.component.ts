import { Component, OnInit } from '@angular/core';
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
      value: 'en',
    },
    {
      key: 'Spanish',
      value: 'es',
    },
  ];
  languaje: string;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.languaje = this.languajes[1].value;
    this.translate.setDefaultLang(this.languaje);
  }

  changeLanguaje() {
    this.translate.setDefaultLang(this.languaje);
  }
}
