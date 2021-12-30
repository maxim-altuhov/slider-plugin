// prettier-ignore
const keysWatchList: { [key: string]: string[] } = {
  changedValue: [
    'initValueFirst',
    'initValueSecond',
    'textValueFirst',
    'textValueSecond',
  ],
  maxValue: [
    'minValue',
    'initValueFirst',
    'initValueSecond',
    'numberOfDecimalPlaces',
  ],
  minValue: [
    'maxValue',
    'initValueFirst',
    'initValueSecond',
    'numberOfDecimalPlaces',
  ],
  step: [
    'initValueFirst',
    'initValueSecond',
    'numberOfDecimalPlaces',
    'stepSizeForScale',
  ],
  customValues: [
    'initValueFirst',
    'initValueSecond',
    'textValueFirst',
    'textValueSecond',
    'minValue',
    'maxValue',
    'step',
    'stepSizeForScale',
    'numberOfDecimalPlaces',
    'initFormatted',
    'calcNumberOfDecimalPlaces',
    'initAutoScaleCreation',
    'checkingStepSizeForScale',
  ],
  numberOfDecimalPlaces: [
    'initValueFirst',
    'initValueSecond',
    'minValue',
    'maxValue',
    'step',
  ],
  initValueFirst: ['initValueSecond', 'textValueFirst', 'textValueSecond'],
  initValueSecond: ['initValueFirst', 'textValueFirst', 'textValueSecond'],
  initAutoScaleCreation: ['checkingStepSizeForScale', 'stepSizeForScale'],
  checkingStepSizeForScale: ['initAutoScaleCreation', 'stepSizeForScale'],
  isRange: ['initValueFirst', 'textValueFirst'],
  calcNumberOfDecimalPlaces: ['numberOfDecimalPlaces'],
  isVertical: ['initAutoMargins'],
};

export default keysWatchList;
