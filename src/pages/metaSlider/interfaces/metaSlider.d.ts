/**
 * I use the any type in [key: string]: any to be able to
 * access any property in the object with slider options.
 */
interface IPluginOptions {
  [key: string]: any;
  key: string;
  $selector: JQuery;
  $elemSlider: JQuery;
  $sliderProgress: JQuery;
  $elemMarkers: JQuery;
  $elemScale: JQuery;
  $elemThumbs: JQuery;
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
  init(this: JQuery, settings?: object): JQuery;
  setProp(this: JQuery, prop: string, value: string | number | (string | number)[]): JQuery;
  getProp(this: JQuery, prop: string): string | number | (string | number)[];
  getOptionsObj(this: JQuery): IPluginOptions;
  getCurrentValues(this: JQuery): string[] | number[];
  destroy(this: JQuery): JQuery;
  subscribe(this: JQuery, observer: Function): void;
  unsubscribe(this: JQuery, observer: Function): void;
}

interface IErrMessage {
  [key: string]: string;
}
