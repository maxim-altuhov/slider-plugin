interface PluginOptions {
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
  minValue: number;
  maxValue: number;
  stepSizeForScale: null | number;
  numberOfDecimalPlaces: number;
  preFix: string;
  postFix: string;
  customValues: (string | number)[];
  initValueFirst: null | number;
  initValueSecond: null | number;
  textValueFirst: string;
  textValueSecond: string;
}

interface PluginMethods {
  [index: string]: any;
  init(this: JQuery, settings?: object): JQuery;
  setProp(
    this: JQuery,
    prop: string,
    value: string | number | (string | number)[],
  ): JQuery;
  getProp(this: JQuery, prop: string): string | number | (string | number)[];
  getOptionsObj(this: JQuery): object;
  getCurrentValues(this: JQuery): [string, string] | [number, number];
  destroy(this: JQuery): JQuery;
  subscribe(this: JQuery, observer: Function): void;
  unsubscribe(this: JQuery, observer: Function): void;
}
