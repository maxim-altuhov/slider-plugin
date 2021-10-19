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
    this.initValuesCheck();
    this.calcValueInPrecentage();
    this.notify(this.opt);
  }

  update() {
    this.initValuesCheck();
    this.calcValueInPrecentage();
    this.notify(this.opt);
  }

  getInfoAboutSlider() {
    this.opt.$elemSlider = this.opt.$selector.find('.js-meta-slider');
    this.opt.$sliderProgress = this.opt.$selector.find('.js-meta-slider__progress');
    this.opt.$elemThumbs = this.opt.$selector.find('.js-meta-slider__thumb');
    this.opt.$elemMarkers = this.opt.$selector.find('.js-meta-slider__marker');
    this.opt.$elemScale = this.opt.$selector.find('.js-meta-slider__scale');
  }

  checkIsIntegerSizeScale() {
    return Number.isInteger((this.opt.maxValue - this.opt.minValue) / this.opt.stepSizeForScale);
  }

  getNumberOfDecimalPlaces() {
    this.opt.numberOfDecimalPlaces = this.opt.step.toString().includes('.') ? this.opt.step.toString().match(/\.(\d+)/)[1].length : 0;
  }

  resetInitValue() {
    this.opt.initValueSecond = this.opt.maxValue;
    this.opt.initValueFirst = this.opt.minValue;
  }

  initCustomValues() {
    const { key } = this.opt;
    if (key === 'init' || key === 'customValues') {
      this.opt.minValue = 0;
      this.opt.maxValue = this.opt.customValues.length - 1;
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

  checkCorrectStepSizeForScale(errorMessage) {
    const isIntegerStepSizeForScale = Number.isInteger(this.opt.stepSizeForScale);

    while (!this.checkIsIntegerSizeScale()) {
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

  initValuesCheck() {
    const errMessage = {
      initValue: 'Ошибка во входящих данных для бегунков слайдера. Установлены значения по-умолчанию.',
      minAndMaxValue: 'Max значение установленное для слайдера меньше или равно его Min значению. Установлены значения по-умолчанию.',
      stepSizeForScale: 'Установите корректное значение шага для шкалы с делениями. Установлено ближайщее оптимальное значение.',
      step: 'Значение шага слайдера не может быть больше его макс.значения, а также меньше или равно 0.',
    };

    this.opt.initValueFirst = this.opt.isRange ? this.opt.initValueFirst : this.opt.minValue;
    this.opt.customValues = (typeof this.opt.customValues === 'string') ? this.opt.customValues.split(',') : this.opt.customValues;
    this.opt.customValues = this.opt.customValues.filter((elem) => (elem !== '' && elem !== ' '));

    if (this.opt.setNumberOfDecimalPlaces) this.getNumberOfDecimalPlaces();

    if (this.opt.minValue > this.opt.maxValue || this.opt.minValue === this.opt.maxValue) {
      this.opt.minValue = 0;
      this.opt.maxValue = 100;
      this.errorEvent.notify(errMessage.minAndMaxValue, this.opt);
    }

    if (this.opt.initValueFirst > this.opt.initValueSecond) {
      this.resetInitValue();
      this.errorEvent.notify(errMessage.initValue, this.opt);
    }

    if (this.opt.step <= 0 || this.opt.step > this.opt.maxValue) {
      this.opt.step = this.opt.maxValue;
      this.errorEvent.notify(errMessage.step, this.opt);
    }

    if (this.opt.stepSizeForScale <= 0 || this.opt.stepSizeForScale > this.opt.maxValue) {
      this.opt.stepSizeForScale = this.opt.maxValue;
      this.errorEvent.notify(errMessage.stepSizeForScale, this.opt);
    }

    if (this.opt.initValueSecond > this.opt.maxValue
      || this.opt.initValueFirst > this.opt.maxValue) {
      this.resetInitValue();
      this.errorEvent.notify(errMessage.initValue, this.opt);
    } else if (this.opt.initValueSecond < this.opt.minValue
      || this.opt.initValueFirst < this.opt.minValue) {
      this.resetInitValue();
      this.errorEvent.notify(errMessage.initValue, this.opt);
    }

    if (this.opt.customValues.length > 0) {
      this.initCustomValues();
    }

    if (this.opt.checkingStepSizeForScale && !this.opt.initAutoScaleCreation) {
      this.checkCorrectStepSizeForScale(errMessage);
    }

    this.opt.initValueFirst = this.calcTargetValue(null, this.opt.initValueFirst, true);
    this.opt.initValueSecond = this.calcTargetValue(null, this.opt.initValueSecond, true);

    this.opt.initValuesArray = [this.opt.initValueFirst, this.opt.initValueSecond];
  }

  calcValueInPrecentage() {
    this.opt.valuesAsPercentageArray = this.opt.initValuesArray.map((currentValue) => {
      return ((currentValue - this.opt.minValue) / (this.opt.maxValue - this.opt.minValue)) * 100;
    });
  }

  checkTargetValue(targetValue, event) {
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
    const isEventMoveKeypress = (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'ArrowUp' || event.code === 'ArrowDown');
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

    const calcForInitValue = (
      ((initValue - minValue) / (maxValue - minValue)) * 100
    );
    const calcForEventValue = (valueInEventPosition / sliderSize) * 100;
    const valueAsPercentage = (initValue === undefined) ? calcForEventValue : calcForInitValue;
    const stepCounter = (maxValue - minValue) / step;
    const stepAsPercent = 100 / stepCounter;

    let totalPercent = Math.round(valueAsPercentage / stepAsPercent) * stepAsPercent;

    if (totalPercent < 0) totalPercent = 0;
    if (totalPercent > 100) totalPercent = 100;

    const resultValue = (totalPercent / stepAsPercent) * step;
    const targetValue = (
      Number(resultValue.toFixed(numberOfDecimalPlaces)) + minValue
    );

    if (onlyReturn) return targetValue;
    this.checkTargetValue(targetValue, event);

    return undefined;
  }
}

export default Model;
