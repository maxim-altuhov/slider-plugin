type TypePluginOptions =
  | JQuery<HTMLElement>
  | string
  | number
  | boolean
  | (number | string)[]
  | null;

interface IPluginOptions {
  [key: string]: TypePluginOptions;
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
}

interface IObserver {
  subscribe(observer: (...args: any[]) => unknown): void;
  unsubscribe(observer: (...args: any[]) => unknown): void;
  notify(...arg: any[]): void;
}

interface ISubView extends Partial<IObserver> {
  update(options: IPluginOptions): void;
}
