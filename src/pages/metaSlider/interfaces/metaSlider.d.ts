/**
 * I use the any type in [key: string]: any to be able to
 * access any property in the object with slider options.
 */
interface IPluginOptions {
  [key: string]: any;
  key: string;
  $selector: JQuery<HTMLElement>;
  $elemSlider: JQuery<HTMLElement>;
  $sliderProgress: JQuery<HTMLElement>;
  $elemMarkers: JQuery<HTMLElement>;
  $elemScale: JQuery<HTMLElement>;
  $elemThumbs: JQuery<HTMLElement>;
  mainColor: string;
  secondColor: string;
  colorMarker: string;
  colorThumb: string;
  colorTextForMarker: string;
  colorBorderForMarker: string;
  colorBorderForThumb: string;
  colorForScale: string;
  initFormatted: boolean;
  initAutoMargins: boolean;
  initScaleAdjustment: boolean;
  calcNumberOfDecimalPlaces: boolean;
  showError: boolean;
  showScale: boolean;
  showMarkers: boolean;
  showBackground: boolean;
  isRange: boolean;
  isVertical: boolean;
  initAutoScaleCreation: boolean;
  checkingStepSizeForScale: boolean;
  step: number;
  stepAsPercent: number;
  minValue: number;
  maxValue: number;
  stepSizeForScale: number | null;
  numberOfDecimalPlaces: number;
  preFix: string;
  postFix: string;
  customValues: (number | string)[] | string;
  initValueFirst: number | null;
  initValueSecond: number | null;
  initValuesArray: number[];
  textValueFirst: string;
  textValueSecond: string;
  textValuesArray: string[];
  valuesAsPercentageArray: number[];
}

interface IPluginMethods {
  [key: string]: any;
  init(this: JQuery<HTMLElement>, settings?: object & { [key: string]: any }): JQuery<HTMLElement>;
  setProp(
    this: JQuery<HTMLElement>,
    prop: string,
    value: string | number | (string | number)[],
  ): JQuery<HTMLElement>;
  getProp(this: JQuery<HTMLElement>, prop: string): string | number | (string | number)[];
  getOptionsObj(this: JQuery<HTMLElement>): IPluginOptions;
  getCurrentValues(this: JQuery<HTMLElement>): string[] | number[];
  destroy(this: JQuery<HTMLElement>): JQuery<HTMLElement>;
  subscribe(this: JQuery<HTMLElement>, observer: Function): void;
  unsubscribe(this: JQuery<HTMLElement>, observer: Function): void;
}

interface ISubViewsUpdate {
  update(options: IPluginOptions): void;
}

interface ISubViewsError {
  renderError(message: string, options: IPluginOptions): void;
}

interface IMainView {
  readonly viewError: ISubViewsError;
  readonly subViewsList: Record<string, ISubViewsUpdate>;
  renderSlider($initSelector: JQuery): void;
  renderError(message: string, options: IPluginOptions): void;
  updateViews(options: IPluginOptions): void;
  updateModel(event: Event, targetValue?: number): void;
}

interface IErrMessage {
  [key: string]: string;
}
