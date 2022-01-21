import Observer from '../patterns/Observer';

class Model extends Observer {
  opt;
  errorEvent = new Observer();
  private _listSavedStatus: { [index: string]: boolean | string } = {};

  constructor(selector: JQuery<HTMLElement>, options: IPluginOptions) {
    super();
    this.opt = options;
    this.opt.$selector = selector;
  }

  // Initial initialization of the model
  init() {
    this.opt.key = 'init';
    this._getSliderSelectors();
    this._checkingIncomingProp();
    this._calcValuesInPercentage();
    this.notify(this.opt);
  }

  // Method called when updating the model from the outside
  update() {
    this._checkingIncomingProp();
    this._calcValuesInPercentage();
    this.notify(this.opt);
  }

  // Calculation of thumbs slider position values
  calcTargetValue(
    event: (Event & { clientY: number; clientX: number }) | null,
    initValue?: number,
    onlyReturn = false,
  ): number | null {
    const {
      $elemSlider,
      isVertical,
      minValue,
      maxValue,
      step,
      stepAsPercent,
      numberOfDecimalPlaces,
    } = this.opt;
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

    if (initValue !== undefined) {
      valueAsPercentage = ((initValue - minValue) / (maxValue - minValue)) * 100;
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
    const { initValuesArray, isRange } = this.opt;
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

    if (targetValue < averageValue && isRange) {
      initValuesArray[0] = targetValue;
      this._listSavedStatus['activeThumb'] = 'first';
    } else if (targetValue > averageValue || !isRange) {
      initValuesArray[1] = targetValue;
      this._listSavedStatus['activeThumb'] = 'second';
    }

    this._calcValuesInPercentage();
    this._setCurrentValues();
  }

  private _calcValuesInPercentage() {
    const { initValuesArray, minValue, maxValue } = this.opt;

    this.opt.valuesAsPercentageArray = initValuesArray.map(
      (currentValue) => ((currentValue - minValue) / (maxValue - minValue)) * 100,
    );
  }

  private _setCurrentValues() {
    const { initValuesArray, customValues } = this.opt;
    const [firstValue, secondValue] = initValuesArray;
    this.opt.initValueFirst = firstValue;
    this.opt.initValueSecond = secondValue;

    if (customValues.length > 0) {
      this.opt.textValueFirst = String(customValues[this.opt.initValueFirst]);
      this.opt.textValueSecond = String(customValues[this.opt.initValueSecond]);
      this.opt.textValuesArray = [this.opt.textValueFirst, this.opt.textValueSecond];
    }

    this.opt.key = 'changedValue';
    this.notify(this.opt);
  }

  private _calcStepAsPercentage() {
    const { key } = this.opt;
    const listVerifKeys = [
      'init',
      'step',
      'maxValue',
      'minValue',
      'customValues',
      'numberOfDecimalPlaces',
    ];

    if (listVerifKeys.includes(key)) {
      const { maxValue, minValue, step } = this.opt;
      this.opt.stepAsPercent = 100 / ((maxValue - minValue) / step);
    }
  }

  // Checking incoming slider settings
  private _checkingIncomingProp() {
    const errMessage: IErrMessage = {
      initValue: `Ошибка во входящих данных для одного или нескольких бегунков слайдера. 
      Установлено значение по-умолчанию.`,
      minAndMaxValue: `Max значение установленное для слайдера меньше его Min значения. 
      Установлено значение по-умолчанию.`,
      stepSizeForScale: `Установите корректное значение шага для шкалы с делениями. 
      Установлено ближайщее оптимальное значение.`,
      step: `Значение шага слайдера не может быть больше разницы между макс. и мин. значением, 
      а также меньше или равно 0.`,
    };

    this._checkingIsVerticalSlider();
    this._checkingNumberOfDecimalPlaces();
    this._checkingMinMaxValues(errMessage);
    this._checkingShowScaleStatus();
    this._checkingStepSize(errMessage);
    this._checkingCustomValues();
    this._calcStepAsPercentage();
    this._checkingInitValues(errMessage);
  }

  private _getSliderSelectors() {
    const { $selector } = this.opt;

    this.opt.$elemSlider = $selector.find('.js-meta-slider');
    this.opt.$sliderProgress = $selector.find('.js-meta-slider__progress');
    this.opt.$elemThumbs = $selector.find('.js-meta-slider__thumb');
    this.opt.$elemMarkers = $selector.find('.js-meta-slider__marker');
    this.opt.$elemScale = $selector.find('.js-meta-slider__scale');
  }

  private _checkingIsVerticalSlider() {
    const verifKeysObj = {
      verticalSliderKeys: ['init', 'isVertical'],
      autoMarginsKeys: ['init', 'initAutoMargins'],
    };
    const { key, isVertical, initAutoMargins } = this.opt;
    const { verticalSliderKeys, autoMarginsKeys } = verifKeysObj;

    if (autoMarginsKeys.includes(key)) {
      this._listSavedStatus['autoMargins'] = initAutoMargins;
    }

    if (verticalSliderKeys.includes(key) && !isVertical) {
      this.opt.initAutoMargins = Boolean(this._listSavedStatus['autoMargins']);
    }

    if (verticalSliderKeys.includes(key) && isVertical) this.opt.initAutoMargins = false;
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
    const { key, calcNumberOfDecimalPlaces } = this.opt;
    const { getNumberKeys, checkNumberKeys } = verifKeysObj;

    if (getNumberKeys.includes(key) && calcNumberOfDecimalPlaces) this._getNumberOfDecimalPlaces();

    if (checkNumberKeys.includes(key)) {
      if (this.opt.numberOfDecimalPlaces < 0) this.opt.numberOfDecimalPlaces = 0;

      if (!Number.isInteger(this.opt.numberOfDecimalPlaces)) {
        this.opt.numberOfDecimalPlaces = Number(this.opt.numberOfDecimalPlaces.toFixed());
      }
    }
  }

  // Automatic calculation of the number of decimal places for slider values
  private _getNumberOfDecimalPlaces() {
    const propToCheck = ['minValue', 'maxValue', 'step'];

    // prettier-ignore
    const resultArr = propToCheck.map((prop) =>
      this.opt[prop].toString().includes('.') ? this.opt[prop].toString().match(/\.(\d+)/)[1].length : 0,
    );

    this.opt.numberOfDecimalPlaces = Math.max(...resultArr);
  }

  private _checkingMinMaxValues(errMessage: IErrMessage) {
    // prettier-ignore
    const { 
      key,
      initValueFirst,
      initValueSecond,
      minValue,
      maxValue,
      numberOfDecimalPlaces,
    } = this.opt;

    const listVerifKeys = ['init', 'minValue', 'maxValue', 'numberOfDecimalPlaces'];

    if (listVerifKeys.includes(key)) {
      this.opt.minValue = Number(minValue.toFixed(numberOfDecimalPlaces));
      this.opt.maxValue = Number(maxValue.toFixed(numberOfDecimalPlaces));

      // prettier-ignore
      if (this.opt.minValue > this.opt.maxValue ) this.errorEvent.notify(errMessage['minAndMaxValue'], this.opt);

      if (this.opt.minValue >= this.opt.maxValue) {
        this.opt.minValue = initValueFirst ?? 0;
        this.opt.maxValue = initValueSecond ?? 100;
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
    } = this.opt;

    const SHOW_SCALE_KEY = 'showScale';
    const listVerifKeys = ['init', SHOW_SCALE_KEY];

    if (!showScale && listVerifKeys.includes(key)) {
      this._listSavedStatus['initAutoScaleCreation'] = initAutoScaleCreation;
      this._listSavedStatus['initScaleAdjustment'] = initScaleAdjustment;
      this._listSavedStatus['checkingStepSizeForScale'] = checkingStepSizeForScale;

      this.opt.initAutoScaleCreation = false;
      this.opt.initScaleAdjustment = false;
      this.opt.checkingStepSizeForScale = false;
    } else if (showScale && key === SHOW_SCALE_KEY) {
      this.opt.initAutoScaleCreation = Boolean(this._listSavedStatus['initAutoScaleCreation']);
      this.opt.initScaleAdjustment = Boolean(this._listSavedStatus['initScaleAdjustment']);
      this.opt.checkingStepSizeForScale = Boolean(
        this._listSavedStatus['checkingStepSizeForScale'],
      );
    }
  }

  private _checkingStepSize(errMessage: IErrMessage) {
    this.opt.stepSizeForScale = this.opt.stepSizeForScale ?? this.opt.step;

    // prettier-ignore
    const {
      key,
      maxValue,
      minValue,
      numberOfDecimalPlaces,
      initAutoScaleCreation,
    } = this.opt;

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
      this.opt.step = Number(this.opt.step.toFixed(numberOfDecimalPlaces));

      if (this.opt.step <= 0 || this.opt.step > differenceMinAndMax) {
        this.opt.step = differenceMinAndMax;
        this.errorEvent.notify(errMessage['step'], this.opt);
      }

      if (initAutoScaleCreation) {
        this.opt.checkingStepSizeForScale = false;
        this.opt.stepSizeForScale = this.opt.step;
      }

      if (this.opt.stepSizeForScale <= 0 || this.opt.stepSizeForScale > differenceMinAndMax) {
        this.opt.stepSizeForScale = differenceMinAndMax;
        this.errorEvent.notify(errMessage['stepSizeForScale'], this.opt);
      }

      if (this.opt.checkingStepSizeForScale && !initAutoScaleCreation) {
        this._checkingCorrectStepSizeForScale(errMessage);
      }
    }
  }

  /**
   * Checking whether the scale is completely divided by the set scale step
   * and adjusting the scale step
   */
  private _checkingCorrectStepSizeForScale(errMessage: IErrMessage) {
    const { maxValue, minValue } = this.opt;

    if (this.opt.stepSizeForScale) {
      const isIntegerStepSizeForScale = Number.isInteger(this.opt.stepSizeForScale);

      while (!Number.isInteger((maxValue - minValue) / this.opt.stepSizeForScale)) {
        if (this.opt.stepSizeForScale > 1 && isIntegerStepSizeForScale) {
          this.opt.stepSizeForScale += 1;
        } else if (!isIntegerStepSizeForScale) {
          this.opt.stepSizeForScale += 0.1;
          this.opt.stepSizeForScale = Number(this.opt.stepSizeForScale.toFixed(1));
        } else {
          break;
        }

        this.errorEvent.notify(errMessage['stepSizeForScale'], this.opt);
      }
    }
  }

  private _checkingCustomValues() {
    const { key, customValues } = this.opt;
    const listVerifKeys = ['init', 'customValues'];

    if (listVerifKeys.includes(key)) {
      // prettier-ignore
      this.opt.customValues = (typeof customValues === 'string') ? customValues.split(',') : customValues;
      this.opt.customValues = this.opt.customValues
        .filter((elem) => elem !== '' && elem !== ' ')
        .map((elem) => String(elem).trim());

      if (this.opt.customValues.length > 0) this._initCustomValues();
    }
  }

  // Resetting default options when setting custom values
  private _initCustomValues() {
    const { customValues } = this.opt;

    if (customValues.length === 1 && Array.isArray(customValues)) {
      customValues.push(customValues[0]);
    }

    this.opt.minValue = 0;
    this.opt.maxValue = customValues.length - 1;
    this.opt.initAutoScaleCreation = false;
    this.opt.initScaleAdjustment = false;
    this.opt.checkingStepSizeForScale = false;
    this.opt.initFormatted = false;
    this.opt.calcNumberOfDecimalPlaces = false;
    this.opt.numberOfDecimalPlaces = 0;
    this.opt.step = 1;
    this.opt.stepSizeForScale = 1;
  }

  private _checkingInitValues(errMessage: IErrMessage) {
    this.opt.initValueFirst = this.opt.initValueFirst ?? this.opt.minValue;
    this.opt.initValueSecond = this.opt.initValueSecond ?? this.opt.maxValue;

    // prettier-ignore
    const { 
      key,
      initValueFirst,
      initValueSecond,
      minValue,
      maxValue,
      isRange,
      customValues,
    } = this.opt;

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
      if (firstValueIsIncorrect || valuesOverlap) {
        this.opt.initValueFirst = minValue;
        this.errorEvent.notify(errMessage['initValue'], this.opt);
      }

      if (secondValueIsIncorrect || valuesOverlap) {
        this.opt.initValueSecond = maxValue;
        this.errorEvent.notify(errMessage['initValue'], this.opt);
      }

      this.opt.initValueFirst = isRange ? this.opt.initValueFirst : minValue;
      this.opt.initValueFirst = this.calcTargetValue(null, this.opt.initValueFirst, true);
      this.opt.initValueSecond = this.calcTargetValue(null, this.opt.initValueSecond, true);

      if (this.opt.initValueFirst !== null && this.opt.initValueSecond !== null) {
        if (customValues.length > 0) {
          this.opt.textValueFirst = String(customValues[this.opt.initValueFirst]);
          this.opt.textValueSecond = String(customValues[this.opt.initValueSecond]);
          this.opt.textValuesArray = [this.opt.textValueFirst, this.opt.textValueSecond];
        } else {
          this.opt.textValueFirst = '';
          this.opt.textValueSecond = '';
          this.opt.textValuesArray = [];
        }
      }
    }

    if (this.opt.initValueFirst !== null && this.opt.initValueSecond !== null) {
      this.opt.initValuesArray = [this.opt.initValueFirst, this.opt.initValueSecond];
    }
  }
}

export default Model;
