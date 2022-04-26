interface JQuery {
  metaSlider(
    initParam: 'setProp',
    prop:
      | 'mainColor'
      | 'secondColor'
      | 'colorMarker'
      | 'colorThumb'
      | 'colorTextForMarker'
      | 'colorBorderForMarker'
      | 'colorBorderForThumb'
      | 'colorForScale'
      | 'preFix'
      | 'postFix',
    value: string,
  ): JQuery<HTMLElement>;
  metaSlider(
    initParam: 'setProp',
    prop:
      | 'initFormatted'
      | 'initAutoMargins'
      | 'initScaleAdjustment'
      | 'calcNumberOfDecimalPlaces'
      | 'showScale'
      | 'showMarkers'
      | 'showBackground'
      | 'isRange'
      | 'isVertical'
      | 'initAutoScaleCreation'
      | 'checkingStepSizeForScale',
    value: boolean,
  ): JQuery<HTMLElement>;
  metaSlider(
    initParam: 'setProp',
    prop:
      | 'step'
      | 'minValue'
      | 'maxValue'
      | 'numberOfDecimalPlaces'
      | 'stepSizeForScale'
      | 'initValueFirst'
      | 'initValueSecond',
    value: number,
  ): JQuery<HTMLElement>;
  metaSlider<Type>(initParam: 'setProp', prop: string, value: Type): JQuery<HTMLElement>;
  metaSlider(
    initParam: 'getProp',
    prop:
      | 'key'
      | 'mainColor'
      | 'secondColor'
      | 'colorMarker'
      | 'colorThumb'
      | 'colorTextForMarker'
      | 'colorBorderForMarker'
      | 'colorBorderForThumb'
      | 'colorForScale'
      | 'preFix'
      | 'postFix'
      | 'textValueFirst'
      | 'textValueSecond',
  ): string;
  metaSlider(
    initParam: 'getProp',
    prop:
      | 'initFormatted'
      | 'initAutoMargins'
      | 'initScaleAdjustment'
      | 'calcNumberOfDecimalPlaces'
      | 'showScale'
      | 'showMarkers'
      | 'showBackground'
      | 'isRange'
      | 'isVertical'
      | 'initAutoScaleCreation'
      | 'checkingStepSizeForScale',
  ): boolean;
  metaSlider(
    initParam: 'getProp',
    prop:
      | 'step'
      | 'stepAsPercent'
      | 'minValue'
      | 'maxValue'
      | 'stepSizeForScale'
      | 'numberOfDecimalPlaces'
      | 'initValueFirst'
      | 'initValueSecond',
  ): number;
  metaSlider(
    initParam: 'getProp',
    prop:
      | '$selector'
      | '$elemSlider'
      | '$sliderProgress'
      | '$elemMarkers'
      | '$elemScale'
      | '$elemThumbs',
  ): JQuery<HTMLElement>;
  metaSlider(initParam: 'getProp', prop: 'textValuesArray'): string[];
  metaSlider(initParam: 'getProp', prop: 'initValuesArray' | 'valuesAsPercentageArray'): number[];
  metaSlider(initParam: 'getProp', prop: 'customValues'): (number | string)[] | string;
  metaSlider<Type>(initParam: 'getProp', prop: string): Type;
  metaSlider(
    initParam: 'subscribe' | 'unsubscribe',
    observer: (...args: any[]) => unknown,
  ): JQuery<HTMLElement>;
  metaSlider(initParam: 'getCurrentValues'): string[] | number[];
  metaSlider(initParam: 'getOptionsObj'): IPluginOptions;
  metaSlider(initParam: 'destroy'): JQuery<HTMLElement>;
  metaSlider(initParam: 'init', settings?: Partial<IPluginOptions>): JQuery<HTMLElement>;
  metaSlider(
    initParam?: string | Partial<IPluginOptions>,
  ): JQuery<HTMLElement> | IPluginOptions | string | number | boolean | (number | string)[];
}
