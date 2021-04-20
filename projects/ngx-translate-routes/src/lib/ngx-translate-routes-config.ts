export class NgxTranslateRoutesConfig {
  constructor(
    public enableTitleTranslate?: boolean,
    public enableRouteTranslate?: boolean
  ) {
    this.enableRouteTranslate =
      enableRouteTranslate !== undefined ? enableRouteTranslate : true;
    this.enableTitleTranslate =
      enableTitleTranslate !== undefined ? enableTitleTranslate : true;
  }
}
