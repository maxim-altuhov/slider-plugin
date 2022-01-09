import Observer from '../patterns/Observer';

class Model extends Observer {
  opt;
  errorEvent = new Observer();
  private _propSavedStatus: { [index: string]: boolean } = {};

  constructor(selector: JQuery, options: IPluginOptions) {
    super();
    this.opt = options;
    this.opt.$selector = selector;
  }

  // Первичная инициализация модели
  init() {
    this.opt.key = 'init';
    this._getSliderSelectors();
    this._checkingIncomingProp();
    this._calcValuesInPercentage();
    this.notify(this.opt);
  }

  // Метод вызываемый при обновлении модели снаружи
  update() {
    this._checkingIncomingProp();
    this._calcValuesInPercentage();
    this.notify(this.opt);
  }

  // Расчёт значений позиций бегунков слайдера
  calcTargetValue(
    event: (Event & { target: EventTarget; clientY: number; clientX: number }) | null,
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
    this._checkingTargetValue(targetValue, event, eventPosition);

    return null;
  }

  /**
   * Проверка рассчитанных значений слайдера на выполнение различных условий
   * и определение какой бегунок у слайдера должен быть перемещён
   */
  private _checkingTargetValue(
    targetValue: number,
    event: (Event & { target: EventTarget; code?: string }) | null,
    eventPosition: number,
  ) {
    this.opt.initValueFirst = this.opt.initValueFirst ?? this.opt.minValue;
    this.opt.initValueSecond = this.opt.initValueSecond ?? this.opt.maxValue;

    // prettier-ignore
    const { 
      initValueFirst,
      initValueSecond,
      isRange, 
      initValuesArray, 
      $elemThumbs, 
      isVertical,
    } = this.opt;

    const firstThumbDiff = Math.abs(Number((targetValue - initValueFirst).toFixed(2)));
    const secondThumbDiff = Math.abs(Number((targetValue - initValueSecond).toFixed(2)));
    let clickInRange = false;

    if (isRange) clickInRange = targetValue > initValueFirst && targetValue < initValueSecond;
    if (targetValue <= initValueFirst) initValuesArray[0] = targetValue;
    if (targetValue >= initValueSecond || !isRange) initValuesArray[1] = targetValue;

    if (clickInRange && firstThumbDiff < secondThumbDiff) {
      initValuesArray[0] = targetValue;
    } else if (clickInRange && firstThumbDiff > secondThumbDiff) {
      initValuesArray[1] = targetValue;
    }

    const isIdenticalDistanceInRange = clickInRange && firstThumbDiff === secondThumbDiff;
    const code = event?.code;

    // prettier-ignore
    const isEventMoveKeypress = (code === 'ArrowLeft' || code === 'ArrowRight' || code === 'ArrowUp' || code === 'ArrowDown') && event;
    const [firstThumb, secondThumb] = $elemThumbs;
    let firstThumbPosition = 0;
    let secondThumbPosition = 0;

    if (isVertical) {
      firstThumbPosition = firstThumb.getBoundingClientRect().bottom;
      secondThumbPosition = secondThumb.getBoundingClientRect().top;
    } else if (!isVertical) {
      firstThumbPosition = firstThumb.getBoundingClientRect().left;
      secondThumbPosition = secondThumb.getBoundingClientRect().right;
    }

    if (isIdenticalDistanceInRange && !isEventMoveKeypress) {
      const firstValuePosition = Math.abs(eventPosition - firstThumbPosition);
      const secondValuePosition = Math.abs(eventPosition - secondThumbPosition);

      if (Math.round(secondValuePosition - firstValuePosition) >= 0) {
        initValuesArray[0] = targetValue;
      } else {
        initValuesArray[1] = targetValue;
      }
    }

    if (isIdenticalDistanceInRange && isEventMoveKeypress) {
      const $target = $(event.target);

      if ($target.hasClass('meta-slider__thumb_left')) {
        initValuesArray[0] = targetValue;
      } else {
        initValuesArray[1] = targetValue;
      }
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

    const calcStepAsPercentVerifKeys =
      key === 'init' ||
      key === 'step' ||
      key === 'maxValue' ||
      key === 'minValue' ||
      key === 'customValues' ||
      key === 'numberOfDecimalPlaces';

    if (calcStepAsPercentVerifKeys) {
      const { maxValue, minValue, step } = this.opt;
      this.opt.stepAsPercent = 100 / ((maxValue - minValue) / step);
    }
  }

  // Проверка входящих настроек для слайдера
  private _checkingIncomingProp() {
    const errMessage: IErrMessage = {
      initValue: `Ошибка во входящих данных для одного или нескольких бегунков слайдера. Установлено 
      значение по-умолчанию.`,
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
    const { key, isVertical, initAutoMargins } = this.opt;
    const verticalSliderVerifKeys = key === 'init' || key === 'isVertical';

    if (key === 'init' || key === 'initAutoMargins') {
      this._propSavedStatus['autoMargins'] = initAutoMargins;
    }

    if (verticalSliderVerifKeys && !isVertical) {
      this.opt.initAutoMargins = this._propSavedStatus['autoMargins'];
    }

    if (verticalSliderVerifKeys && isVertical) this.opt.initAutoMargins = false;
  }

  private _checkingNumberOfDecimalPlaces() {
    const { key, calcNumberOfDecimalPlaces } = this.opt;

    const calcNumberVerifKeys =
      key === 'init' ||
      key === 'calcNumberOfDecimalPlaces' ||
      key === 'initValueFirst' ||
      key === 'initValueSecond' ||
      key === 'minValue' ||
      key === 'maxValue' ||
      key === 'step';

    if (calcNumberVerifKeys && calcNumberOfDecimalPlaces) this._getNumberOfDecimalPlaces();

    if (key === 'init' || key === 'numberOfDecimalPlaces') {
      if (this.opt.numberOfDecimalPlaces < 0) this.opt.numberOfDecimalPlaces = 0;

      if (!Number.isInteger(this.opt.numberOfDecimalPlaces)) {
        this.opt.numberOfDecimalPlaces = Number(this.opt.numberOfDecimalPlaces.toFixed());
      }
    }
  }

  // Автоматический рассчёт кол-ва знаков после запятой у значений слайдера
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

    // prettier-ignore
    const verifKeys =
      key === 'init' ||
      key === 'minValue' ||
      key === 'maxValue' ||
      key === 'numberOfDecimalPlaces';

    if (verifKeys) {
      this.opt.minValue = Number(minValue.toFixed(numberOfDecimalPlaces));
      this.opt.maxValue = Number(maxValue.toFixed(numberOfDecimalPlaces));

      if (this.opt.minValue >= this.opt.maxValue) {
        this.opt.minValue = initValueFirst ?? 0;
        this.opt.maxValue = initValueSecond ?? 100;

        // prettier-ignore
        if (this.opt.minValue > this.opt.maxValue ) this.errorEvent.notify(errMessage['minAndMaxValue'], this.opt);
      }
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

    const initVerifKeys =
      key === 'init' ||
      key === 'initAutoScaleCreation' ||
      key === 'step' ||
      key === 'stepSizeForScale' ||
      key === 'maxValue' ||
      key === 'minValue' ||
      key === 'numberOfDecimalPlaces';

    const differenceMinAndMax = maxValue - minValue;

    if (initVerifKeys) {
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

  // Проверка делится ли шкала без остатка на установленный шаг шкалы
  private _checkingIsIntegerSizeScale(stepSizeForScale: number) {
    const { maxValue, minValue } = this.opt;

    return Number.isInteger((maxValue - minValue) / stepSizeForScale);
  }

  // Корректировка шага шкалы, если не выполняется условие в методе checkingIsIntegerSizeScale()
  private _checkingCorrectStepSizeForScale(errMessage: IErrMessage) {
    if (this.opt.stepSizeForScale) {
      const isIntegerStepSizeForScale = Number.isInteger(this.opt.stepSizeForScale);

      while (!this._checkingIsIntegerSizeScale(this.opt.stepSizeForScale)) {
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

    if (key === 'init' || key === 'customValues') {
      // prettier-ignore
      this.opt.customValues = (typeof customValues === 'string') ? customValues.split(',') : customValues;
      this.opt.customValues = this.opt.customValues.filter((elem) => elem !== '' && elem !== ' ');

      if (this.opt.customValues.length > 0) this._initCustomValues();
    }
  }

  // Сброс опций по-умолчанию при установке кастомных значений
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

    const verifKeys =
      key === 'init' ||
      key === 'initValueFirst' ||
      key === 'initValueSecond' ||
      key === 'minValue' ||
      key === 'maxValue' ||
      key === 'isRange' ||
      key === 'step' ||
      key === 'numberOfDecimalPlaces' ||
      key === 'customValues';

    const firstValueIsIncorrect = initValueFirst > maxValue || initValueFirst < minValue;
    const secondValueIsIncorrect = initValueSecond > maxValue || initValueSecond < minValue;
    const valuesOverlap = initValueFirst > initValueSecond;

    if (verifKeys) {
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
