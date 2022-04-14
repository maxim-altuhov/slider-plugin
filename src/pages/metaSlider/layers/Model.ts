import Observer from '../patterns/Observer';

class Model extends Observer {
  private _opt;
  private _listSavedStatus: { [index: string]: boolean | string } = {};

  constructor(selector: JQuery<HTMLElement>, options: IPluginOptions) {
    super();
    this._opt = options;
    this._opt.$selector = selector;
  }

  // Initial initialization of the model
  init() {
    this._opt.key = 'init';
    this._getSliderSelectors();
    this._checkingIncomingProp();
    this._calcValuesInPercentage();
    this.notify(this._opt);
  }

  // Method called when updating the model from the outside
  update() {
    this._checkingIncomingProp();
    this._calcValuesInPercentage();
    this.notify(this._opt);
  }

  getOptions() {
    return { ...this._opt };
  }

  getProp(prop: string) {
    const options = this.getOptions();

    return options[prop];
  }

  setProp(prop: string, value: string | number | boolean | (string | number)[]) {
    this._opt[prop] = value;
  }

  // Calculation of thumbs slider position values
  calcTargetValue(onlyReturn: boolean, inputValue?: number, event?: MouseEvent): number | null {
    const {
      $elemSlider,
      isVertical,
      minValue,
      maxValue,
      step,
      stepAsPercent,
      numberOfDecimalPlaces,
    } = this._opt;
    let eventPosition = 0;
    let sliderOffset = 0;
    let sliderSize = 0;
    let valueInEventPosition = 0;
    let valueAsPercentage = 0;

    if (isVertical && event) {
      eventPosition = event.clientY;
      sliderOffset = $elemSlider[0].getBoundingClientRect().bottom;
      sliderSize = $elemSlider[0].getBoundingClientRect().height;
      valueInEventPosition = sliderOffset - eventPosition;
    } else if (!isVertical && event) {
      eventPosition = event.clientX;
      sliderOffset = $elemSlider.offset()?.left || 0;
      sliderSize = $elemSlider.outerWidth() || 0;
      valueInEventPosition = eventPosition - sliderOffset;
    }

    if (inputValue !== undefined) {
      valueAsPercentage = ((inputValue - minValue) / (maxValue - minValue)) * 100;
    } else {
      valueAsPercentage = (valueInEventPosition / sliderSize) * 100;
    }

    let totalPercent = Math.round(valueAsPercentage / stepAsPercent) * stepAsPercent;

    if (totalPercent < 0) totalPercent = 0;
    if (totalPercent > 100) totalPercent = 100;

    const resultValue = (totalPercent / stepAsPercent) * step;
    const targetValue = Number((resultValue + minValue).toFixed(numberOfDecimalPlaces));

    if (onlyReturn) return targetValue;
    this._checkingTargetValue(targetValue);

    return null;
  }

  /**
   * Checking the calculated values of the slider for the fulfillment
   * of various conditions and determining which slider should be moved
   */
  private _checkingTargetValue(targetValue: number) {
    const { initValuesArray, isRange } = this._opt;
    const { activeThumb } = this._listSavedStatus;
    const averageValue = (initValuesArray[0] + initValuesArray[1]) / 2;
    const currentActiveThumb = {
      FIRST: 'first',
      SECOND: 'second',
    };

    if (targetValue === averageValue) {
      if (activeThumb === currentActiveThumb.FIRST) {
        initValuesArray[0] = targetValue;
      } else if (activeThumb === currentActiveThumb.SECOND) {
        initValuesArray[1] = targetValue;
      } else {
        initValuesArray[0] = targetValue;
      }
    }

    const targetValueLessThanAverage = targetValue < averageValue;
    const targetValueMoreThanAverage = targetValue > averageValue;

    if (targetValueLessThanAverage && isRange) {
      initValuesArray[0] = targetValue;
      this._listSavedStatus['activeThumb'] = 'first';
    } else if (targetValueMoreThanAverage || !isRange) {
      initValuesArray[1] = targetValue;
      this._listSavedStatus['activeThumb'] = 'second';
    }

    this._calcValuesInPercentage();
    this._setCurrentValues();
  }

  private _calcValuesInPercentage() {
    const { initValuesArray, minValue, maxValue } = this._opt;

    this._opt.valuesAsPercentageArray = initValuesArray.map(
      (currentValue) => ((currentValue - minValue) / (maxValue - minValue)) * 100,
    );
  }

  private _setCurrentValues() {
    const { initValuesArray, customValues } = this._opt;
    const [firstValue, secondValue] = initValuesArray;
    this._opt.initValueFirst = firstValue;
    this._opt.initValueSecond = secondValue;

    if (customValues.length > 0) {
      this._opt.textValueFirst = String(customValues[this._opt.initValueFirst]);
      this._opt.textValueSecond = String(customValues[this._opt.initValueSecond]);
      this._opt.textValuesArray = [this._opt.textValueFirst, this._opt.textValueSecond];
    }

    this._opt.key = 'changedValue';
    this.notify(this._opt);
  }

  private _calcStepAsPercentage() {
    const { key } = this._opt;
    const listVerifKeys = [
      'init',
      'step',
      'maxValue',
      'minValue',
      'customValues',
      'numberOfDecimalPlaces',
    ];

    if (listVerifKeys.includes(key)) {
      const { maxValue, minValue, step } = this._opt;
      this._opt.stepAsPercent = 100 / ((maxValue - minValue) / step);
    }
  }

  // Checking incoming slider settings
  private _checkingIncomingProp() {
    this._checkingIsVerticalSlider();
    this._checkingNumberOfDecimalPlaces();
    this._checkingMinMaxValues();
    this._checkingShowScaleStatus();
    this._checkingStepSize();
    this._checkingCustomValues();
    this._calcStepAsPercentage();
    this._checkingInitValues();
  }

  private _getSliderSelectors() {
    const { $selector } = this._opt;

    this._opt.$elemSlider = $selector.find('.js-meta-slider');
    this._opt.$sliderProgress = $selector.find('.js-meta-slider__progress');
    this._opt.$elemThumbs = $selector.find('.js-meta-slider__thumb');
    this._opt.$elemMarkers = $selector.find('.js-meta-slider__marker');
    this._opt.$elemScale = $selector.find('.js-meta-slider__scale');
  }

  private _checkingIsVerticalSlider() {
    const verifKeysObj = {
      verticalSliderKeys: ['init', 'isVertical'],
      autoMarginsKeys: ['init', 'initAutoMargins'],
    };
    const { key, isVertical, initAutoMargins } = this._opt;
    const { verticalSliderKeys, autoMarginsKeys } = verifKeysObj;

    if (autoMarginsKeys.includes(key)) {
      this._listSavedStatus['autoMargins'] = initAutoMargins;
    }

    if (verticalSliderKeys.includes(key) && !isVertical) {
      this._opt.initAutoMargins = Boolean(this._listSavedStatus['autoMargins']);
    }

    if (verticalSliderKeys.includes(key) && isVertical) this._opt.initAutoMargins = false;
  }

  private _checkingNumberOfDecimalPlaces() {
    const verifKeysObj = {
      getNumberKeys: [
        'init',
        'calcNumberOfDecimalPlaces',
        'initValueFirst',
        'initValueSecond',
        'minValue',
        'maxValue',
        'step',
      ],
      checkNumberKeys: ['init', 'numberOfDecimalPlaces'],
    };
    const { key } = this._opt;
    const { getNumberKeys, checkNumberKeys } = verifKeysObj;
    const isInit = key === 'init';

    if (this._opt.numberOfDecimalPlaces < 0) this._opt.numberOfDecimalPlaces = 0;

    const numberOfDecimalPlacesIsNotNull = this._opt.numberOfDecimalPlaces !== 0;

    if (numberOfDecimalPlacesIsNotNull && isInit) this._opt.calcNumberOfDecimalPlaces = false;

    if (getNumberKeys.includes(key) && this._opt.calcNumberOfDecimalPlaces) {
      this._getNumberOfDecimalPlaces();
    }

    if (checkNumberKeys.includes(key) && !Number.isInteger(this._opt.numberOfDecimalPlaces)) {
      this._opt.numberOfDecimalPlaces = Number(this._opt.numberOfDecimalPlaces.toFixed());
    }
  }

  // Automatic calculation of the number of decimal places for slider values
  private _getNumberOfDecimalPlaces() {
    const propToCheck = ['minValue', 'maxValue', 'step'];

    // prettier-ignore
    const resultArr = propToCheck.map((prop) =>
      this._opt[prop].toString().includes('.') ? this._opt[prop].toString().match(/\.(\d+)/)[1].length : 0,
    );

    this._opt.numberOfDecimalPlaces = Math.max(...resultArr);
  }

  private _checkingMinMaxValues() {
    // prettier-ignore
    const { 
      key,
      initValueFirst,
      initValueSecond,
      minValue,
      maxValue,
      numberOfDecimalPlaces,
    } = this._opt;

    const listVerifKeys = ['init', 'minValue', 'maxValue', 'numberOfDecimalPlaces'];
    const isInit = key === 'init';

    if (listVerifKeys.includes(key)) {
      const minValueIsIncorrect = initValueFirst && minValue > initValueFirst && isInit;
      const maxValueIsIncorrect = initValueSecond && maxValue < initValueSecond && isInit;

      if (minValueIsIncorrect) this._opt.minValue = initValueFirst;
      if (maxValueIsIncorrect) this._opt.maxValue = initValueSecond;

      this._opt.minValue = Number(this._opt.minValue.toFixed(numberOfDecimalPlaces));
      this._opt.maxValue = Number(this._opt.maxValue.toFixed(numberOfDecimalPlaces));

      if (this._opt.minValue >= this._opt.maxValue) {
        this._opt.minValue = initValueFirst ?? 0;
        this._opt.maxValue = initValueSecond ?? 100;
      }
    }
  }

  private _checkingShowScaleStatus() {
    // prettier-ignore
    const {
      key,
      showScale,
      initAutoScaleCreation,
      initScaleAdjustment,
      checkingStepSizeForScale,
    } = this._opt;

    const listVerifKeys = ['init', 'showScale'];
    const isShowScaleKey = key === 'showScale';

    if (!showScale && listVerifKeys.includes(key)) {
      this._listSavedStatus['initAutoScaleCreation'] = initAutoScaleCreation;
      this._listSavedStatus['initScaleAdjustment'] = initScaleAdjustment;
      this._listSavedStatus['checkingStepSizeForScale'] = checkingStepSizeForScale;

      this._opt.initAutoScaleCreation = false;
      this._opt.initScaleAdjustment = false;
      this._opt.checkingStepSizeForScale = false;
    } else if (showScale && isShowScaleKey) {
      this._opt.initAutoScaleCreation = Boolean(this._listSavedStatus['initAutoScaleCreation']);
      this._opt.initScaleAdjustment = Boolean(this._listSavedStatus['initScaleAdjustment']);
      this._opt.checkingStepSizeForScale = Boolean(
        this._listSavedStatus['checkingStepSizeForScale'],
      );
    }
  }

  private _checkingStepSize() {
    const { key } = this._opt;
    const isInit = key === 'init';

    if (this._opt.stepSizeForScale && isInit) this._opt.initAutoScaleCreation = false;
    this._opt.stepSizeForScale = this._opt.stepSizeForScale ?? this._opt.step;

    // prettier-ignore
    const {
      maxValue,
      minValue,
      numberOfDecimalPlaces,
      initAutoScaleCreation,
    } = this._opt;

    const listVerifKeys = [
      'init',
      'initAutoScaleCreation',
      'step',
      'stepSizeForScale',
      'maxValue',
      'minValue',
      'numberOfDecimalPlaces',
    ];

    const differenceMinAndMax = maxValue - minValue;

    if (listVerifKeys.includes(key)) {
      this._opt.step = Number(this._opt.step.toFixed(numberOfDecimalPlaces));
      const isIncorrectStepSize = this._opt.step <= 0 || this._opt.step > differenceMinAndMax;

      if (isIncorrectStepSize) this._opt.step = differenceMinAndMax;

      if (initAutoScaleCreation) {
        this._opt.checkingStepSizeForScale = false;
        this._opt.stepSizeForScale = this._opt.step;
      }

      const isIncorrectStepSizeForScale =
        this._opt.stepSizeForScale <= 0 || this._opt.stepSizeForScale > differenceMinAndMax;

      if (isIncorrectStepSizeForScale) this._opt.stepSizeForScale = differenceMinAndMax;

      if (this._opt.checkingStepSizeForScale && !initAutoScaleCreation) {
        this._checkingCorrectStepSizeForScale();
      }
    }
  }

  /**
   * Checking whether the scale is completely divided by the set scale step
   * and adjusting the scale step
   */
  private _checkingCorrectStepSizeForScale() {
    const { maxValue, minValue } = this._opt;

    if (this._opt.stepSizeForScale) {
      const isIntegerStepSizeForScale = Number.isInteger(this._opt.stepSizeForScale);

      while (!Number.isInteger((maxValue - minValue) / this._opt.stepSizeForScale)) {
        if (this._opt.stepSizeForScale > 1 && isIntegerStepSizeForScale) {
          this._opt.stepSizeForScale += 1;
        } else if (!isIntegerStepSizeForScale) {
          this._opt.stepSizeForScale += 0.1;
          this._opt.stepSizeForScale = Number(this._opt.stepSizeForScale.toFixed(1));
        } else {
          break;
        }
      }
    }
  }

  private _checkingCustomValues() {
    const { key, customValues } = this._opt;
    const listVerifKeys = ['init', 'customValues'];

    if (listVerifKeys.includes(key)) {
      // prettier-ignore
      this._opt.customValues = (typeof customValues === 'string') ? customValues.split(',') : customValues;
      this._opt.customValues = this._opt.customValues
        .filter((elem) => elem !== '' && elem !== ' ')
        .map((elem) => String(elem).trim());

      if (this._opt.customValues.length > 0) this._initCustomValues();
    }
  }

  // Resetting default options when setting custom values
  private _initCustomValues() {
    const { customValues } = this._opt;
    const hasOneCustomValue = customValues.length === 1;

    if (hasOneCustomValue && Array.isArray(customValues)) {
      customValues.push(customValues[0]);
    }

    this._opt.minValue = 0;
    this._opt.maxValue = customValues.length - 1;
    this._opt.initAutoScaleCreation = false;
    this._opt.initScaleAdjustment = false;
    this._opt.checkingStepSizeForScale = false;
    this._opt.initFormatted = false;
    this._opt.calcNumberOfDecimalPlaces = false;
    this._opt.numberOfDecimalPlaces = 0;
    this._opt.step = 1;
    this._opt.stepSizeForScale = 1;
  }

  private _checkingInitValues() {
    this._opt.initValueFirst = this._opt.initValueFirst ?? this._opt.minValue;
    this._opt.initValueSecond = this._opt.initValueSecond ?? this._opt.maxValue;

    // prettier-ignore
    const { 
      key,
      initValueFirst,
      initValueSecond,
      minValue,
      maxValue,
      isRange,
      customValues,
    } = this._opt;

    const listVerifKeys = [
      'init',
      'initValueFirst',
      'initValueSecond',
      'minValue',
      'maxValue',
      'isRange',
      'step',
      'numberOfDecimalPlaces',
      'customValues',
    ];

    const firstValueIsIncorrect = initValueFirst > maxValue || initValueFirst < minValue;
    const secondValueIsIncorrect = initValueSecond > maxValue || initValueSecond < minValue;
    const valuesOverlap = initValueFirst > initValueSecond;

    if (listVerifKeys.includes(key)) {
      if (firstValueIsIncorrect || valuesOverlap) this._opt.initValueFirst = minValue;
      if (secondValueIsIncorrect || valuesOverlap) this._opt.initValueSecond = maxValue;

      this._opt.initValueFirst = isRange ? this._opt.initValueFirst : minValue;
      this._opt.initValueFirst = this.calcTargetValue(true, this._opt.initValueFirst);
      this._opt.initValueSecond = this.calcTargetValue(true, this._opt.initValueSecond);

      if (this._opt.initValueFirst !== null && this._opt.initValueSecond !== null) {
        if (customValues.length > 0) {
          this._opt.textValueFirst = String(customValues[this._opt.initValueFirst]);
          this._opt.textValueSecond = String(customValues[this._opt.initValueSecond]);
          this._opt.textValuesArray = [this._opt.textValueFirst, this._opt.textValueSecond];
        } else {
          this._opt.textValueFirst = '';
          this._opt.textValueSecond = '';
          this._opt.textValuesArray = [];
        }
      }
    }

    if (this._opt.initValueFirst !== null && this._opt.initValueSecond !== null) {
      this._opt.initValuesArray = [this._opt.initValueFirst, this._opt.initValueSecond];
    }
  }
}

export default Model;
