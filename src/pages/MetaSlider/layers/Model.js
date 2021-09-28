import $ from 'jquery';
import Observer from '../patterns/Observer';

class Model {
  constructor(options) {
    this.opt = options;
    this.$selector = options.$initSelector;
    this.renderErrorEvent = new Observer();
  }

  init() {
    this.initValuesCheck();
    // this.setValueForSlider(this.initValuesArray);
    // this.setMinAndMaxValues();
    // this.createScale();
    // this.checkingScaleSize();
    // this.setEventsSlider();
    // this.setEventsThumbs();
    // this.setEventsWindow();
  }

  getProp(prop) {
    return this.opt[prop];
  }

  setProp(prop, value) {
    this.opt[prop] = value;
  }

  getOptionsObj() {
    return this.opt;
  }

  renderError(message) {
    this.renderErrorEvent.notify(message);
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

    const checkedValueFirst = this.opt.isRange ? this.opt.initValueFirst : this.opt.minValue;
    this.setProp('checkedValueFirst', checkedValueFirst);

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

      this.setProp('minAndMaxArray', [
        this.opt.customValues[0],
        this.opt.customValues[this.opt.customValues.length - 1],
      ]);
    } else {
      this.setProp('minAndMaxArray', [this.opt.minValue, this.opt.maxValue]);
    }

    if (this.opt.checkingStepSizeForScale && !this.opt.initAutoScaleCreation) {
      this.checkCorrectStepSizeForScale(errMessage);
    }

    if (this.opt.verifyInitValues) {
      this.opt.checkedValueFirst = this.initValueCorrection(this.opt.checkedValueFirst, errMessage);
      this.opt.initValueSecond = this.initValueCorrection(this.opt.initValueSecond, errMessage);
    }

    this.setProp('initValuesArray', [this.opt.checkedValueFirst, this.opt.initValueSecond]);
  }

  setMinAndMaxValues() {
    this.$elemSlider.css('margin-bottom', '').attr({ 'data-min': this.minValue, 'data-max': this.maxValue });

    if (this.customValues.length > 0) {
      const firstCustomElem = this.customValues[0];
      const lastCustomElem = this.customValues[this.customValues.length - 1];
      this.$elemSlider.attr({ 'data-min_text': firstCustomElem, 'data-max_text': lastCustomElem });
    }

    if (this.showMinAndMax) {
      const HTMLBlockValues = `<button type="button" class="meta-slider__value js-meta-slider__value meta-slider__value_min" style="color: ${this.colorTextForMinAndMax}"></button>
      <button type="button" class="meta-slider__value js-meta-slider__value meta-slider__value_max" style="color: ${this.colorTextForMinAndMax}"></button>`;
      this.$elemSlider.append(HTMLBlockValues);

      this.$elemMinAndMaxValues = this.$selector.find('.js-meta-slider__value');

      this.$elemMinAndMaxValues.each((index, currentElem) => {
        const $currentElem = $(currentElem);
        const currentValue = this.minAndMaxArray[index];

        if (this.customValues.length === 0) {
          let convertedValue = this.initFormatted
            ? currentValue.toLocaleString()
            : currentValue.toFixed(this.numberOfDecimalPlaces);

          $currentElem.text(`${this.preFix}${convertedValue}${this.postFix}`);
          $currentElem.attr('data-value', currentValue);
        } else {
          $currentElem.text(`${this.preFix}${currentValue}${this.postFix}`);
          if (index === 0) $currentElem.attr('data-value', 0);
          if (index === 1) $currentElem.attr('data-value', this.customValues.length - 1);
        }
      });

      if (this.initAutoMargins) this.$elemSlider.css('margin-bottom', `${this.$elemMinAndMaxValues.eq(0).outerHeight() * 2}px`);
    }
  }

  createScale() {
    if (!this.showMinAndMax) this.$elemSlider.css('margin-bottom', '');

    if (this.showTheScale) {
      this.scalePointsSize = 0;
      this.mapSkipScalePoints = new Map();

      const $fragmentWithScale = $(document.createDocumentFragment());
      const $blockScale = $(document.createElement('div'));
      const stepSizeValue = this.initAutoScaleCreation ? this.step : this.stepSizeForScale;
      let currentValue = this.minValue;

      $blockScale.addClass('meta-slider__scale');
      this.$elemSlider.append($blockScale);

      for (; currentValue <= this.maxValue; currentValue += stepSizeValue) {
        currentValue = Number(currentValue.toFixed(this.numberOfDecimalPlaces));

        const isCustomValue = this.customValues.length > 0;
        const convertedValue = this.initFormatted ? currentValue.toLocaleString() : currentValue;
        const resultValue = isCustomValue ? this.customValues[currentValue] : convertedValue;

        const elemScalePoint = `<button type="button" class="meta-slider__scale-point js-meta-slider__scale-point" data-value="${currentValue}">${this.preFix}${resultValue}${this.postFix}</button>`;

        $blockScale.append(elemScalePoint);
        $fragmentWithScale.append($blockScale);
      }

      this.$elemSlider.append($fragmentWithScale);

      this.$elemScalePoints = this.$selector.find('.js-meta-slider__scale-point');

      this.$elemScalePoints.each((index, scalePoint) => {
        const $scalePoint = $(scalePoint);
        const valueInScalePoint = Number($scalePoint.attr('data-value'));
        const resultValue = (valueInScalePoint - this.minValue) / (this.maxValue - this.minValue);
        this.scalePointsSize += $scalePoint.outerWidth();

        $scalePoint.css('left', `${resultValue * 100}%`);
      });

      if (this.initAutoMargins) this.$elemSlider.css('margin-bottom', `${this.$elemScalePoints.eq(0).outerHeight() * 3}px`);
    }
  }

  setValueForSlider(valuesArray) {
    let valuesAsPercentageArray = [];

    valuesArray.forEach((currentValue, index) => {
      const resultValue = (currentValue - this.minValue) / (this.maxValue - this.minValue);
      valuesAsPercentageArray.push(resultValue * 100);

      this.$elemThumbs.eq(index).css('left', `${valuesAsPercentageArray[index]}%`);
      this.$elemThumbs.eq(index).attr('data-value', currentValue.toFixed(this.numberOfDecimalPlaces));

      if (this.customValues.length > 0) {
        this.$elemThumbs.eq(index).attr('data-text', this.customValues[currentValue]);
      }
    });

    this.setBackgroundTheRange(valuesAsPercentageArray);
    this.setValueInMarker();
  }

  setValueInMarker() {
    this.$elemSlider.css('margin-top', '');
    this.$elemMarkers.each((index, elem) => {
      $(elem).css('display', 'none');
    });

    if (this.showMarkers) {
      if (this.initAutoMargins) this.$elemSlider.css('margin-top', `${this.heightMarker + (this.heightThumb / 1.5)}px`);

      this.$elemMarkers.each((index, marker) => {
        const $currentMarker = $(marker);

        if (this.customValues.length > 0) {
          $currentMarker.text(`${this.preFix}${this.$elemThumbs.eq(index).attr('data-text')}${this.postFix}`);
        } else {
          const currentValue = Number(this.$elemThumbs.eq(index).attr('data-value'));
          const checkedValue = Number(currentValue.toFixed(this.numberOfDecimalPlaces));
          const convertedValue = this.initFormatted ? checkedValue.toLocaleString() : checkedValue;

          $currentMarker.text(`${this.preFix}${convertedValue}${this.postFix}`);
        }

        $currentMarker.css('display', '');
      });
    }
  }

  setBackgroundTheRange(valuesAsPercentageArray) {
    if (this.showBackground) {
      const [firstPosition, secondPosition] = valuesAsPercentageArray;
      const settingForRange = { left: `${firstPosition}%`, right: `${100 - secondPosition}%`, background: `${this.mainColor}` };
      this.$sliderProgress.css(settingForRange);
    }
  }

  checkTargetValue(
    targetValue,
    event,
  ) {
    const [firstThumb, secondThumb] = this.$elemThumbs;
    const firstValue = Number(firstThumb.dataset.value);
    const secondtValue = Number(secondThumb.dataset.value);
    const firstThumbDiff = Math.abs((targetValue - firstValue).toFixed(2));
    const secondThumbDiff = Math.abs((targetValue - secondtValue).toFixed(2));
    let clickInRange = false;

    if (this.isRange) clickInRange = targetValue > firstValue && targetValue < secondtValue;

    if (targetValue <= firstValue) this.initValuesArray[0] = targetValue;
    if (targetValue >= secondtValue || !this.isRange) this.initValuesArray[1] = targetValue;

    if (clickInRange && firstThumbDiff < secondThumbDiff) {
      this.initValuesArray[0] = targetValue;
    } else if (clickInRange && firstThumbDiff > secondThumbDiff) {
      this.initValuesArray[1] = targetValue;
    }

    const isIdenticalDistanceInRange = (clickInRange && firstThumbDiff === secondThumbDiff);
    const isEventMoveKeypress = (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'ArrowUp' || event.code === 'ArrowDown');
    let eventPosition;
    let firstThumbPosition;
    let secondThumbPosition;

    if (this.isVertical) {
      eventPosition = event.clientY;
      firstThumbPosition = firstThumb.getBoundingClientRect().bottom;
      secondThumbPosition = secondThumb.getBoundingClientRect().top;
    } else if (!this.isVertical) {
      eventPosition = event.clientX;
      firstThumbPosition = firstThumb.getBoundingClientRect().left;
      secondThumbPosition = secondThumb.getBoundingClientRect().right;
    }

    if (isIdenticalDistanceInRange && !isEventMoveKeypress) {
      const firstValuePosition = Math.abs(eventPosition - firstThumbPosition);
      const secondValuePosition = Math.abs(eventPosition - secondThumbPosition);

      if (Math.round(secondValuePosition - firstValuePosition) >= 0) {
        this.initValuesArray[0] = targetValue;
      } else {
        this.initValuesArray[1] = targetValue;
      }
    }

    if (isIdenticalDistanceInRange && isEventMoveKeypress) {
      const $target = $(event.target);

      if ($target.hasClass('meta-slider__thumb_left')) {
        this.initValuesArray[0] = targetValue;
      } else if ($target.hasClass('meta-slider__thumb_right')) {
        this.initValuesArray[1] = targetValue;
      }
    }

    this.setValueForSlider(this.initValuesArray);
  }

  calcTargetValue(
    event,
    initValue = undefined,
  ) {
    let eventPosition;
    let sliderOffset;
    let sliderSize;
    let valueInEventPosition;

    if (this.isVertical && event) {
      eventPosition = event.clientY;
      sliderOffset = this.$elemSlider[0].getBoundingClientRect().bottom;
      sliderSize = this.$elemSlider[0].getBoundingClientRect().height;
      valueInEventPosition = sliderOffset - eventPosition;
    } else if (!this.isVertical && event) {
      eventPosition = event.clientX;
      sliderOffset = this.$elemSlider.offset().left;
      sliderSize = this.$elemSlider.outerWidth();
      valueInEventPosition = eventPosition - sliderOffset;
    }

    const calcForInitValue = ((initValue - this.minValue) / (this.maxValue - this.minValue)) * 100;
    const calcForEventValue = (valueInEventPosition / sliderSize) * 100;
    const valueAsPercentage = (initValue === undefined) ? calcForEventValue : calcForInitValue;
    const stepCounter = (this.maxValue - this.minValue) / this.step;
    const stepAsPercent = 100 / stepCounter;
    let totalPercent = Math.round(valueAsPercentage / stepAsPercent) * stepAsPercent;

    if (totalPercent < 0) totalPercent = 0;
    if (totalPercent > 100) totalPercent = 100;

    const resultValue = (totalPercent / stepAsPercent) * this.step;
    const targetValue = Number(resultValue.toFixed(this.numberOfDecimalPlaces)) + this.minValue;

    return targetValue;
  }

  setPropForSkipScalePoint($scalePoint) {
    $scalePoint.addClass('meta-slider__scale-point_skip').attr('tabindex', -1);
    this.skipScalePointsArray.push($scalePoint);
  }

  checkingScaleSize() {
    if (this.showTheScale && this.initScaleAdjustment) {
      const MARGIN_POINTS = 100;
      const sliderSize = this.$elemSlider.outerWidth();

      while (this.scalePointsSize + MARGIN_POINTS > sliderSize) {
        const totalSizeScalePoints = this.scalePointsSize + MARGIN_POINTS;
        this.skipScalePointsArray = [];
        this.$elemScalePoints = this.$selector.find('.js-meta-slider__scale-point:not(.meta-slider__scale-point_skip)');
        this.scalePointsSize = 0;

        const sizeScalePointsArray = this.$elemScalePoints.length;

        if (sizeScalePointsArray <= 2) break;

        this.$elemScalePoints.each((index, scalePoint) => {
          const $currentScalePoint = $(scalePoint);
          const firstOrLastIndex = (index === 0) || (index === (sizeScalePointsArray - 1));
          const intervalWithoutFirstAndLastIndex = !firstOrLastIndex && sizeScalePointsArray <= 6;

          if (index % 2 !== 0 && sizeScalePointsArray > 6) {
            this.setPropForSkipScalePoint($currentScalePoint);
          } else if ((sizeScalePointsArray % 2 !== 0) && sizeScalePointsArray <= 6) {
            this.setPropForSkipScalePoint($currentScalePoint);
          } else if ((sizeScalePointsArray % 2 === 0) && intervalWithoutFirstAndLastIndex) {
            this.setPropForSkipScalePoint($currentScalePoint);
          }

          if (!$currentScalePoint.hasClass('meta-slider__scale-point_skip')) this.scalePointsSize += $currentScalePoint.outerWidth();
        });

        this.mapSkipScalePoints.set(totalSizeScalePoints, [...this.skipScalePointsArray]);
      }

      this.mapSkipScalePoints.forEach((scalePointSkipArray, controlSize) => {
        if (sliderSize > controlSize + (MARGIN_POINTS / 3)) {
          scalePointSkipArray.forEach(($scalePoint) => {
            $scalePoint.removeAttr('tabindex').removeClass('meta-slider__scale-point_skip');
            this.scalePointsSize += $scalePoint.outerWidth();
          });

          this.mapSkipScalePoints.delete(controlSize);
        }
      });
    }
  }

  handleGetValueInScalePoint(event) {
    event.preventDefault();
    const $target = $(event.target);
    let targetValue = Number($target.attr('data-value'));

    if (!$target.hasClass('js-meta-slider__value')) {
      targetValue = this.verifyInitValues ? this.calcTargetValue(null, targetValue) : targetValue;
    }

    this.checkTargetValue(
      targetValue,
      event,
    );
  }

  handleSetPositionForThumbs(event) {
    event.preventDefault();
    const $target = $(event.target);

    if ($target.hasClass('js-meta-slider')) {
      const calculateTargetValue = this.calcTargetValue(event);

      this.checkTargetValue(
        calculateTargetValue,
        event,
      );
    }
  }

  handleChangeThumbPosition(event) {
    const configEventCode = (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'ArrowUp' || event.code === 'ArrowDown');
    const $target = $(event.target);
    if (configEventCode) {
      let eventTargetValue = Number($target.attr('data-value'));
      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') event.preventDefault();
      if (event.code === 'ArrowLeft' || event.code === 'ArrowDown') eventTargetValue -= this.step;
      if (event.code === 'ArrowRight' || event.code === 'ArrowUp') eventTargetValue += this.step;

      const calculateTargetValue = this.calcTargetValue(null, eventTargetValue);

      this.checkTargetValue(
        calculateTargetValue,
        event,
      );
    }
  }

  handleInitPointerMove(event) {
    const calculateTargetValue = this.calcTargetValue(event);

    this.checkTargetValue(
      calculateTargetValue,
      event,
    );
  }

  static handleInitPointerUp(event) {
    const $target = $(event.target);
    $target.off('pointermove.thumb');
    $target.off('pointerup.thumb');
  }

  handleSetEventListenerForThumbs(event) {
    const $target = $(event.target);
    event.target.setPointerCapture(event.pointerId);
    $target.on('pointermove.thumb', this.handleInitPointerMove.bind(this));
    $target.on('pointerup.thumb', Model.handleInitPointerUp);
  }

  handleRemoveErrorWindow() {
    this.$elemErrorInfo.remove();
  }

  handleCheckingScaleSize() {
    this.checkingScaleSize();
  }

  setEventsSlider() {
    if (this.$elemScalePoints) {
      this.$elemScalePoints.each((index, elemPoint) => {
        $(elemPoint).on('click.scalePoint', this.handleGetValueInScalePoint.bind(this));
      });
    }

    if (this.$elemMinAndMaxValues) {
      this.$elemMinAndMaxValues.each((index, elem) => {
        $(elem).on('click.minAndMaxValue', this.handleGetValueInScalePoint.bind(this));
      });
    }

    if (this.$btnErrorClose) {
      this.$btnErrorClose.on('click.btnErrorClose', this.handleRemoveErrorWindow.bind(this));
    }

    this.$elemSlider.on('pointerdown.slider', this.handleSetPositionForThumbs.bind(this));
  }

  setEventsThumbs() {
    this.$elemThumbs.each((index, thumb) => {
      const $currentThumb = $(thumb);
      $currentThumb.on('pointerdown.thumb', this.handleSetEventListenerForThumbs.bind(this));
      $currentThumb.on('keydown.thumb', this.handleChangeThumbPosition.bind(this));
      $currentThumb.on('dragstart.thumb', false);
    });
  }

  setEventsWindow() {
    if (this.showTheScale && this.initScaleAdjustment) {
      $(window).on('resize.scale', this.handleCheckingScaleSize.bind(this));
    }
  }
}

export default Model;
