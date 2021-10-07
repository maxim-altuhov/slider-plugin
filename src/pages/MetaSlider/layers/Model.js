import $ from 'jquery';
import Observer from '../patterns/Observer';

class Model {
  constructor(selector, options) {
    this.opt = options;
    this.opt.$initSelector = selector;
    this.errorEvent = new Observer();
    this.setValueForSliderEvent = new Observer();
    this.renderSliderElemEvent = new Observer();
  }

  init() {
    this.initValuesCheck();
    this.setValueForSlider();
    this.renderSliderElem();
  }

  update() {
    this.initValuesCheck();
    console.log(this.opt);
  }

  getProp(prop) {
    return this.opt[prop];
  }

  setProp(prop, value) {
    this.opt[prop] = value;
  }

  renderError(message) {
    this.errorEvent.notify(message);
  }

  checkIsIntegerSizeScale() {
    return Number.isInteger((this.opt.maxValue - this.opt.minValue) / this.opt.stepSizeForScale);
  }

  getNumberOfDecimalPlaces() {
    this.opt.numberOfDecimalPlaces = this.opt.step.toString().includes('.') ? this.opt.step.toString().match(/\.(\d+)/)[1].length : 0;
  }

  resetInitValue() {
    this.opt.initValueSecond = this.opt.maxValue;
    this.opt.checkedValueFirst = this.opt.minValue;
  }

  initCustomValues() {
    this.opt.minValue = 0;
    this.opt.maxValue = this.opt.customValues.length - 1;
    this.opt.initAutoScaleCreation = false;
    this.opt.checkingStepSizeForScale = false;
    this.opt.initFormatted = false;
    this.opt.verifyInitValues = true;
    this.opt.numberOfDecimalPlaces = 0;
    this.opt.step = 1;
    this.opt.stepSizeForScale = 1;
    this.opt.customValues = (typeof this.opt.customValues !== 'string') ? this.opt.customValues : this.opt.customValues.split(',');
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

      this.renderError(errorMessage.stepSizeForScale);
    }
  }

  initValueCorrection(value, errorMessage) {
    const convertedValue = this.calcTargetValue(null, value);
    let resultValue = value;

    if (convertedValue !== value) {
      resultValue = convertedValue;
      this.renderError(errorMessage.initСorrectionValues);
    }

    return resultValue;
  }

  initValuesCheck() {
    const errMessage = {
      initValue: 'Ошибка во входящих данных для бегунков слайдера. Установлены значения по-умолчанию.',
      minAndMaxValue: 'Max значение установленное для слайдера меньше или равно его Min значению. Установлены значения по-умолчанию.',
      stepSizeForScale: 'Установите корректное значение шага для шкалы с делениями. Установлено ближайщее оптимальное значение.',
      step: 'Значение шага слайдера не может быть больше его макс.значения, а также меньше или равно 0.',
      initСorrectionValues: 'Входящие значения для бегунков скорректированны согласно установленному шагу.',
    };

    this.opt.checkedValueFirst = this.opt.isRange ? this.opt.initValueFirst : this.opt.minValue;

    if (this.opt.setNumberOfDecimalPlaces) this.getNumberOfDecimalPlaces();
    if (this.opt.showTheScale) this.opt.showMinAndMax = false;
    if (this.opt.showMinAndMax) this.opt.showTheScale = false;

    if (this.opt.minValue > this.opt.maxValue || this.opt.minValue === this.opt.maxValue) {
      this.opt.minValue = 0;
      this.opt.maxValue = 100;
      this.renderError(errMessage.minAndMaxValue);
    }

    if (this.opt.checkedValueFirst > this.opt.initValueSecond) {
      this.resetInitValue();
      this.renderError(errMessage.initValue);
    }

    if (this.opt.step <= 0 || this.opt.step > this.opt.maxValue) {
      this.opt.step = this.opt.maxValue;
      this.renderError(errMessage.step);
    }

    if (this.opt.stepSizeForScale <= 0 || this.opt.stepSizeForScale > this.opt.maxValue) {
      this.opt.stepSizeForScale = this.opt.maxValue;
      this.renderError(errMessage.stepSizeForScale);
    }

    if (this.opt.initValueSecond > this.opt.maxValue
      || this.opt.checkedValueFirst > this.opt.maxValue) {
      this.resetInitValue();
      this.renderError(errMessage.initValue);
    } else if (this.opt.initValueSecond < this.opt.minValue
      || this.opt.checkedValueFirst < this.opt.minValue) {
      this.resetInitValue();
      this.renderError(errMessage.initValue);
    }

    if (this.opt.customValues.length > 0) {
      this.initCustomValues();

      this.opt.minAndMaxArray = [
        this.opt.customValues[0],
        this.opt.customValues[this.opt.customValues.length - 1],
      ];
    } else {
      this.opt.minAndMaxArray = [this.opt.minValue, this.opt.maxValue];
    }

    if (this.opt.checkingStepSizeForScale && !this.opt.initAutoScaleCreation) {
      this.checkCorrectStepSizeForScale(errMessage);
    }

    if (this.opt.verifyInitValues) {
      this.opt.checkedValueFirst = this.initValueCorrection(this.opt.checkedValueFirst, errMessage);
      this.opt.initValueSecond = this.initValueCorrection(this.opt.initValueSecond, errMessage);
    }

    this.opt.initValuesArray = [this.opt.checkedValueFirst, this.opt.initValueSecond];
  }

  setValueForSlider() {
    this.opt.valuesAsPercentageArray = this.opt.initValuesArray.map((currentValue) => {
      return ((currentValue - this.opt.minValue) / (this.opt.maxValue - this.opt.minValue)) * 100;
    });

    this.setValueForSliderEvent.notify();
  }

  renderSliderElem() {
    this.renderSliderElemEvent.notify();
  }

  checkTargetValue(targetValue, event) {
    const [firstThumb, secondThumb] = this.opt.$elemThumbs;
    const firstValue = Number(firstThumb.dataset.value);
    const secondtValue = Number(secondThumb.dataset.value);
    const firstThumbDiff = Math.abs((targetValue - firstValue).toFixed(2));
    const secondThumbDiff = Math.abs((targetValue - secondtValue).toFixed(2));
    let clickInRange = false;

    if (this.opt.isRange) clickInRange = targetValue > firstValue && targetValue < secondtValue;

    if (targetValue <= firstValue) this.opt.initValuesArray[0] = targetValue;
    if (targetValue >= secondtValue || !this.opt.isRange) this.opt.initValuesArray[1] = targetValue;

    if (clickInRange && firstThumbDiff < secondThumbDiff) {
      this.opt.initValuesArray[0] = targetValue;
    } else if (clickInRange && firstThumbDiff > secondThumbDiff) {
      this.opt.initValuesArray[1] = targetValue;
    }

    const isIdenticalDistanceInRange = (clickInRange && firstThumbDiff === secondThumbDiff);
    const isEventMoveKeypress = (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'ArrowUp' || event.code === 'ArrowDown');
    let eventPosition;
    let firstThumbPosition;
    let secondThumbPosition;

    if (this.opt.isVertical) {
      eventPosition = event.clientY;
      firstThumbPosition = firstThumb.getBoundingClientRect().bottom;
      secondThumbPosition = secondThumb.getBoundingClientRect().top;
    } else if (!this.opt.isVertical) {
      eventPosition = event.clientX;
      firstThumbPosition = firstThumb.getBoundingClientRect().left;
      secondThumbPosition = secondThumb.getBoundingClientRect().right;
    }

    if (isIdenticalDistanceInRange && !isEventMoveKeypress) {
      const firstValuePosition = Math.abs(eventPosition - firstThumbPosition);
      const secondValuePosition = Math.abs(eventPosition - secondThumbPosition);

      if (Math.round(secondValuePosition - firstValuePosition) >= 0) {
        this.opt.initValuesArray[0] = targetValue;
      } else {
        this.opt.initValuesArray[1] = targetValue;
      }
    }

    if (isIdenticalDistanceInRange && isEventMoveKeypress) {
      const $target = $(event.target);

      if ($target.hasClass('meta-slider__thumb_left')) {
        this.opt.initValuesArray[0] = targetValue;
      } else if ($target.hasClass('meta-slider__thumb_right')) {
        this.opt.initValuesArray[1] = targetValue;
      }
    }

    this.setValueForSlider();
  }

  calcTargetValue(event, initValue = undefined) {
    let eventPosition;
    let sliderOffset;
    let sliderSize;
    let valueInEventPosition;

    if (this.opt.isVertical && event) {
      eventPosition = event.clientY;
      sliderOffset = this.opt.$elemSlider[0].getBoundingClientRect().bottom;
      sliderSize = this.opt.$elemSlider[0].getBoundingClientRect().height;
      valueInEventPosition = sliderOffset - eventPosition;
    } else if (!this.opt.isVertical && event) {
      eventPosition = event.clientX;
      sliderOffset = this.opt.$elemSlider.offset().left;
      sliderSize = this.opt.$elemSlider.outerWidth();
      valueInEventPosition = eventPosition - sliderOffset;
    }

    const calcForInitValue = (
      ((initValue - this.opt.minValue) / (this.opt.maxValue - this.opt.minValue)) * 100
    );
    const calcForEventValue = (valueInEventPosition / sliderSize) * 100;
    const valueAsPercentage = (initValue === undefined) ? calcForEventValue : calcForInitValue;
    const stepCounter = (this.opt.maxValue - this.opt.minValue) / this.opt.step;
    const stepAsPercent = 100 / stepCounter;

    let totalPercent = Math.round(valueAsPercentage / stepAsPercent) * stepAsPercent;

    if (totalPercent < 0) totalPercent = 0;
    if (totalPercent > 100) totalPercent = 100;

    const resultValue = (totalPercent / stepAsPercent) * this.opt.step;
    const targetValue = (
      Number(resultValue.toFixed(this.opt.numberOfDecimalPlaces)) + this.opt.minValue
    );

    return targetValue;
  }
}

export default Model;
