export class NgxTranslateRoutesConfig {
  enableTitleTranslate?: boolean;
  enableRouteTranslate?: boolean;

  constructor(
    options: {
      enableTitleTranslate?: boolean;
      enableRouteTranslate?: boolean;
    } = {}
  ) {
    this.enableTitleTranslate =
      options.enableTitleTranslate !== undefined
        ? options.enableTitleTranslate
        : true;
    this.enableRouteTranslate =
      options.enableRouteTranslate !== undefined
        ? options.enableRouteTranslate
        : true;
  }
}
