interface JQuery {
  metaSlider(initParam: any, ...prop: any): any;
}

interface IObjectOrClass {
  [index: string]: any;
}

interface PluginOptions {
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
  minValue: number;
  maxValue: number;
  stepSizeForScale: null | number;
  numberOfDecimalPlaces: number;
  preFix: string;
  postFix: string;
  customValues: any[];
  initValueFirst: null | number;
  initValueSecond: null | number;
  initValuesArray: null | number[];
  textValueFirst: string;
  textValueSecond: string;
  textValuesArray: string[];
  valuesAsPercentageArray: null | number[];
}
