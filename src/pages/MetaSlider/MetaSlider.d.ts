interface JQuery {
  metaSlider();
}

interface PluginMethods {
  init(settings: object): JQuery<Object>;
  setProp(prop: string, value: string | number | (string | number)[]): JQuery<Object>;
  getProp(prop: string);
  getOptionsObj();
  getCurrentValues();
  destroy();
  subscribe(observer);
  unsubscribe(observer);
}

interface PluginProps {
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