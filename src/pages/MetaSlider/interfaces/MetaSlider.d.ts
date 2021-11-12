interface IPluginOptions {
  [index: string]: any;
  key: string;
  $selector: null | JQuery;
  $elemSlider: null | JQuery;
  $sliderProgress: null | JQuery;
  $elemMarkers: null | JQuery;
  $elemScale: null | JQuery;
  $elemThumbs: null | JQuery;
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
  stepSizeForScale: null | number;
  numberOfDecimalPlaces: number;
  preFix: string;
  postFix: string;
  customValues: string[];
  initValueFirst: null | number;
  initValueSecond: null | number;
  initValuesArray: number[];
  textValueFirst: string;
  textValueSecond: string;
  textValuesArray: string[];
  valuesAsPercentageArray: number[];
}

interface IPluginMethods {
  [index: string]: any;
  init(this: JQuery, settings?: Object): JQuery;
  setProp(this: JQuery, prop: string, value: string | number | (string | number)[]): JQuery;
  getProp(this: JQuery, prop: string): string | number | (string | number)[];
  getOptionsObj(this: JQuery): IPluginOptions;
  getCurrentValues(this: JQuery): string[] | number[];
  destroy(this: JQuery): JQuery;
  subscribe(this: JQuery, observer: Function): void;
  unsubscribe(this: JQuery, observer: Function): void;
}

interface IErrMessage {
  initValue: string;
  minAndMaxValue: string;
  stepSizeForScale: string;
  step: string;
}

interface IEvent {
  code?: string;
  clientY?: number;
  clientX?: number;
  target?: HTMLElement;
  pointerId?: number;
  preventDefault?: () => void;
}
