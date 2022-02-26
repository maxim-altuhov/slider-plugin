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
  testWidth?: null | number;
  testHeight?: null | number;
}

interface ISubView {
  observerList: Function[];
  update(options: IPluginOptions): void;
  subscribe(observer: Function): void;
  unsubscribe(observer: Function): void;
  notify(...arg: any): void;
}
