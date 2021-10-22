import $ from 'jquery';
import Observer from '../patterns/Observer';

class Model extends Observer {
  constructor(selector, options) {
    super();
    this.opt = options;
    this.opt.$selector = selector;
    this.errorEvent = new Observer();
  }

  init() {
    this.opt.key = 'init';
    this.getInfoAboutSlider();
    this.checkingIncomingProp();
    this.calcValueInPrecentage();
    this.notify(this.opt);
  }

  update() {
    this.checkingIncomingProp();
    this.calcValueInPrecentage();
    this.notify(this.opt);
  }

  getInfoAboutSlider() {
    const { $selector } = this.opt;

    this.opt.$elemSlider = $selector.find('.js-meta-slider');
    this.opt.$sliderProgress = $selector.find('.js-meta-slider__progress');
    this.opt.$elemThumbs = $selector.find('.js-meta-slider__thumb');
    this.opt.$elemMarkers = $selector.find('.js-meta-slider__marker');
    this.opt.$elemScale = $selector.find('.js-meta-slider__scale');
  }

  getNumberOfDecimalPlaces() {
    const propToCheck = [
      'step',
      'initValueFirst',
      'initValueSecond',
      'minValue',
      'maxValue',
      'stepSizeForScale',
    ];

    const resultArr = propToCheck.map((prop) => {
      return this.opt[prop].toString().includes('.') ? this.opt[prop].toString().match(/\.(\d+)/)[1].length : 0;
    });

    this.opt.numberOfDecimalPlaces = Math.max(...resultArr);
  }

  checkingNumberOfDecimalPlaces() {
    const { setNumberOfDecimalPlaces, numberOfDecimalPlaces } = this.opt;

    if (setNumberOfDecimalPlaces) this.getNumberOfDecimalPlaces();
    if (numberOfDecimalPlaces < 0) this.opt.numberOfDecimalPlaces = 0;

    if (!Number.isInteger(numberOfDecimalPlaces)) {
      this.opt.numberOfDecimalPlaces = Number(this.opt.numberOfDecimalPlaces).toFixed();
    }
  }

  checkingMinMaxValues(errMessage) {
    const { minValue, maxValue, numberOfDecimalPlaces } = this.opt;

    this.opt.minValue = Number(minValue.toFixed(numberOfDecimalPlaces));
    this.opt.maxValue = Number(maxValue.toFixed(numberOfDecimalPlaces));

    if (minValue > maxValue || minValue === maxValue) {
      this.opt.minValue = 0;
      this.opt.maxValue = 100;
      this.errorEvent.notify(errMessage.minAndMaxValue, this.opt);
    }
  }

  checkingIsIntegerSizeScale() {
    const {
      maxValue,
      minValue,
      stepSizeForScale,
    } = this.opt;

    return Number.isInteger((maxValue - minValue) / stepSizeForScale);
  }

  checkingCorrectStepSizeForScale(errorMessage) {
    const isIntegerStepSizeForScale = Number.isInteger(this.opt.stepSizeForScale);

    while (!this.checkingIsIntegerSizeScale()) {
      if (this.opt.stepSizeForScale > 1 && isIntegerStepSizeForScale) {
        this.opt.stepSizeForScale += 1;
      } else if (!isIntegerStepSizeForScale) {
        this.opt.stepSizeForScale += 0.1;
        this.opt.stepSizeForScale = Number(this.opt.stepSizeForScale.toFixed(1));
      } else {
        break;
      }

      this.errorEvent.notify(errorMessage.stepSizeForScale, this.opt);
    }
  }

  checkingStepSize(errMessage) {
    const {
      initAutoScaleCreation,
      step,
      stepSizeForScale,
      maxValue,
      minValue,
      numberOfDecimalPlaces,
    } = this.opt;
    const difference = maxValue - minValue;

    this.opt.step = Number(step.toFixed(numberOfDecimalPlaces));
    this.opt.stepSizeForScale = Number(stepSizeForScale.toFixed(numberOfDecimalPlaces));

    if (initAutoScaleCreation) this.opt.checkingStepSizeForScale = false;

    if (step <= 0 || step > difference) {
      this.opt.step = difference;
      this.errorEvent.notify(errMessage.step, this.opt);
    }

    if (stepSizeForScale <= 0 || stepSizeForScale > difference) {
      this.opt.stepSizeForScale = difference;
      this.errorEvent.notify(errMessage.stepSizeForScale, this.opt);
    }

    if (this.opt.checkingStepSizeForScale && !initAutoScaleCreation) {
      this.checkingCorrectStepSizeForScale(errMessage);
    }
  }

  initCustomValues() {
    const { key, customValues } = this.opt;

    if (key === 'init' || key === 'customValues') {
      this.opt.minValue = 0;
      this.opt.maxValue = customValues.length - 1;
      this.opt.initValueFirst = this.opt.minValue;
      this.opt.initValueSecond = this.opt.maxValue;
      this.opt.initAutoScaleCreation = false;
      this.opt.checkingStepSizeForScale = false;
      this.opt.initFormatted = false;
      this.opt.setNumberOfDecimalPlaces = false;
      this.opt.numberOfDecimalPlaces = 0;
      this.opt.step = 1;
      this.opt.stepSizeForScale = 1;
    }
  }

  checkingCustomValues() {
    this.opt.customValues = (typeof this.opt.customValues === 'string') ? this.opt.customValues.split(',') : this.opt.customValues;
    this.opt.customValues = this.opt.customValues.filter((elem) => (elem !== '' && elem !== ' '));

    if (this.opt.customValues.length > 0) this.initCustomValues();
  }

  checkingInitValues(errMessage) {
    const {
      initValueFirst,
      initValueSecond,
      minValue,
      maxValue,
      isRange,
    } = this.opt;

    const checkingKeys = (
      initValueFirst > initValueSecond
      || initValueFirst > maxValue
      || initValueFirst < minValue
      || initValueSecond > maxValue
      || initValueSecond < minValue
    );

    if (checkingKeys) {
      this.opt.initValueFirst = minValue;
      this.opt.initValueSecond = maxValue;
      this.errorEvent.notify(errMessage.initValue, this.opt);
    }

    this.opt.initValueFirst = isRange ? this.opt.initValueFirst : minValue;
    this.opt.initValueFirst = this.calcTargetValue(null, this.opt.initValueFirst, true);
    this.opt.initValueSecond = this.calcTargetValue(null, this.opt.initValueSecond, true);
  }

  checkingIncomingProp() {
    const errMessage = {
      initValue: 'Ошибка во входящих данных для бегунков слайдера. Установлены значения по-умолчанию.',
      minAndMaxValue: 'Max значение установленное для слайдера меньше или равно его Min значению. Установлены значения по-умолчанию.',
      stepSizeForScale: 'Установите корректное значение шага для шкалы с делениями. Установлено ближайщее оптимальное значение.',
      step: 'Значение шага слайдера не может быть больше разницы между макс. и мин. значением, а также меньше или равно 0.',
    };

    if (this.opt.isVertical) this.opt.initAutoMargins = false;

    this.checkingNumberOfDecimalPlaces();
    this.checkingMinMaxValues(errMessage);
    this.checkingStepSize(errMessage);
    this.checkingCustomValues();
    this.checkingInitValues(errMessage);

    this.opt.initValuesArray = [this.opt.initValueFirst, this.opt.initValueSecond];
  }

  calcValueInPrecentage() {
    const {
      initValuesArray,
      minValue,
      maxValue,

    } = this.opt;

    this.opt.valuesAsPercentageArray = initValuesArray.map((currentValue) => {
      return ((currentValue - minValue) / (maxValue - minValue)) * 100;
    });
  }

  checkingTargetValue(targetValue, event) {
    const {
      initValueFirst,
      initValueSecond,
      isRange,
      initValuesArray,
      $elemThumbs,
      isVertical,
    } = this.opt;
    const firstThumbDiff = Math.abs((targetValue - initValueFirst).toFixed(2));
    const secondThumbDiff = Math.abs((targetValue - initValueSecond).toFixed(2));
    let clickInRange = false;

    if (isRange) clickInRange = targetValue > initValueFirst && targetValue < initValueSecond;
    if (targetValue <= initValueFirst) initValuesArray[0] = targetValue;
    if (targetValue >= initValueSecond || !isRange) initValuesArray[1] = targetValue;

    if (clickInRange && firstThumbDiff < secondThumbDiff) {
      initValuesArray[0] = targetValue;
    } else if (clickInRange && firstThumbDiff > secondThumbDiff) {
      initValuesArray[1] = targetValue;
    }

    const [firstThumb, secondThumb] = $elemThumbs;
    const isIdenticalDistanceInRange = (clickInRange && firstThumbDiff === secondThumbDiff);
    const isEventMoveKeypress = (
      event.code === 'ArrowLeft'
      || event.code === 'ArrowRight'
      || event.code === 'ArrowUp'
      || event.code === 'ArrowDown'
    );
    let eventPosition;
    let firstThumbPosition;
    let secondThumbPosition;

    if (isVertical) {
      eventPosition = event.clientY;
      firstThumbPosition = firstThumb.getBoundingClientRect().bottom;
      secondThumbPosition = secondThumb.getBoundingClientRect().top;
    } else if (!isVertical) {
      eventPosition = event.clientX;
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
      } else if ($target.hasClass('meta-slider__thumb_right')) {
        initValuesArray[1] = targetValue;
      }
    }

    this.calcValueInPrecentage();
    this.opt.initValueFirst = initValuesArray[0];
    this.opt.initValueSecond = initValuesArray[1];
    this.opt.key = 'changedValue';
    this.notify(this.opt);
  }

  calcTargetValue(event, initValue, onlyReturn = false) {
    const {
      $elemSlider,
      isVertical,
      minValue,
      maxValue,
      step,
      numberOfDecimalPlaces,
    } = this.opt;
    let eventPosition;
    let sliderOffset;
    let sliderSize;
    let valueInEventPosition;

    if (isVertical && event) {
      eventPosition = event.clientY;
      sliderOffset = $elemSlider[0].getBoundingClientRect().bottom;
      sliderSize = $elemSlider[0].getBoundingClientRect().height;
      valueInEventPosition = sliderOffset - eventPosition;
    } else if (!isVertical && event) {
      eventPosition = event.clientX;
      sliderOffset = $elemSlider.offset().left;
      sliderSize = $elemSlider.outerWidth();
      valueInEventPosition = eventPosition - sliderOffset;
    }

    const calcForInitValue = ((initValue - minValue) / (maxValue - minValue)) * 100;
    const calcForEventValue = (valueInEventPosition / sliderSize) * 100;
    const valueAsPercentage = (initValue === undefined) ? calcForEventValue : calcForInitValue;
    const stepCounter = (maxValue - minValue) / step;
    const stepAsPercent = 100 / stepCounter;

    let totalPercent = Math.round(valueAsPercentage / stepAsPercent) * stepAsPercent;

    if (totalPercent < 0) totalPercent = 0;
    if (totalPercent > 100) totalPercent = 100;

    const resultValue = (totalPercent / stepAsPercent) * step;
    const targetValue = Number((resultValue + minValue).toFixed(numberOfDecimalPlaces));

    if (onlyReturn) return targetValue;
    this.checkingTargetValue(targetValue, event);

    return undefined;
  }
}

export default Model;
