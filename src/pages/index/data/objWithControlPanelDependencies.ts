type TypeObjWithDependencies = {
  checkingOptions: string[];
  isReverseDependency: boolean;
};

const objWithControlPanelDependencies: { [key: string]: TypeObjWithDependencies } = {
  isRange: {
    checkingOptions: ['initValueFirst'],
    isReverseDependency: true,
  },
  isVertical: {
    checkingOptions: ['initAutoMargins'],
    isReverseDependency: false,
  },
  initAutoScaleCreation: {
    checkingOptions: ['stepSizeForScale', 'checkingStepSizeForScale'],
    isReverseDependency: false,
  },
  checkingStepSizeForScale: {
    checkingOptions: ['initAutoScaleCreation'],
    isReverseDependency: false,
  },
  calcNumberOfDecimalPlaces: {
    checkingOptions: ['numberOfDecimalPlaces'],
    isReverseDependency: false,
  },
  customValues: {
    checkingOptions: [
      'minValue',
      'maxValue',
      'step',
      'stepSizeForScale',
      'initAutoScaleCreation',
      'numberOfDecimalPlaces',
      'calcNumberOfDecimalPlaces',
      'checkingStepSizeForScale',
      'initFormatted',
      'initScaleAdjustment',
    ],
    isReverseDependency: false,
  },
};

export default objWithControlPanelDependencies;
