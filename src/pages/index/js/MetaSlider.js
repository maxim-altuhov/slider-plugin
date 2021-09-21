class MetaSlider {
  mainColor = '#6d6dff';
  secondColor = '#e4e4e4';
  colorMarker = this.mainColor;
  colorTextForMarker = '#ffffff'
  colorBorderForMarker = '#ffffff'
  colorBorderForThumb = '#ffffff'
  colorTextForMinAndMaxValue = '#000000'

  enableСorrectionValues = true;
  enableFormatted = true;
  enableAutoMargins = true;
  enableScaleAdjustment = true;
  showError = true;
  showMinAndMaxValue = true;
  showTheScale = true;
  showMarkers = true;
  showBackgroundForRange = true;
  isRange = true;
  isVertical = false;
  enableAutoScaleCreation = true;
  checkingStepSizeForScale = !this.enableAutoScaleCreation;

  step = 10;
  minValue = 0;
  maxValue = 100;
  stepSizeForScale = this.step;
  numberOfDecimalPlaces = this.getNumberOfDecimalPlaces();
  preFix = '';
  postFix = '';
  // 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'
  customValues = [];
  initValueFirst = 0;
  initValueSecond = 100;
  checkedValueFirst = this.isRange ? this.initValueFirst : this.minValue;

  constructor() {
    this.getInitSelector('#slider');
    this.renderSlider();
    this.getInfoAboutSlider();
    this.initValuesCheck();
    this.setVerticalOrientation();
    this.init();
  }

  init() {
    this.setValueForSlider(this.initValuesArray);
    this.setMinAndMaxValues();
    this.createScaleOfValues();
    this.checkingScaleSize();
    this.setEventsSlider();
    this.setEventsThumbs();
    this.setEventsWindow();
  }

  getInitSelector(initSelector) {
    this.selector = document.querySelector(initSelector);
  }

  setVerticalOrientation() {
    if (this.isVertical) {
      this.enableAutoMargins = false;
      this.elemSlider.classList.add('meta-slider_vertical');
      if (this.elemErrorInfo) this.elemErrorInfo.classList.add('error-info_vertical');
    }
  }

  checkIsIntegerSizeScale() {
    return Number.isInteger((this.maxValue - this.minValue) / this.stepSizeForScale);
  }

  getNumberOfDecimalPlaces() {
    return this.step.toString().includes('.') ? this.step.toString().match(/\.(\d+)/)[1].length : 0;
  }

  renderErrorMessage(message) {
    if (this.showError) {
      const HTMLBlockError = `<div class="error-info"><p class="error-info__text">${message}</p><button type="button" class="error-info__close">X</button></div>`;
      this.elemSlider.insertAdjacentHTML('afterend', HTMLBlockError);
      this.showError = false;

      this.elemErrorInfo = this.selector.querySelector('.error-info');
      this.btnErrorClose = this.selector.querySelector('.error-info__close');
    }
  }

  resetInitValue() {
    this.initValueSecond = this.maxValue;
    this.checkedValueFirst = this.minValue;
  }

  initCustomValues() {
    this.minValue = 0;
    this.maxValue = this.customValues.length - 1;
    this.enableAutoScaleCreation = false;
    this.checkingStepSizeForScale = false;
    this.enableFormatted = false;
    this.enableСorrectionValues = true;
    this.numberOfDecimalPlaces = 0;
    this.step = 1;
    this.stepSizeForScale = 1;
  }

  checkCorrectStepSizeForScale(errorMessage) {
    while (!this.checkIsIntegerSizeScale()) {
      if (this.stepSizeForScale > 1 && Number.isInteger(this.stepSizeForScale)) {
        this.stepSizeForScale += 1;
      } else if (!Number.isInteger(this.stepSizeForScale)) {
        this.stepSizeForScale += 0.1;
        this.stepSizeForScale = Number(this.stepSizeForScale.toFixed(1));
      } else {
        break;
      }

      this.renderErrorMessage(errorMessage.stepSizeForScale);
    }
  }

  initValueCorrection(value, errorMessage) {
    const convertedValue = this.calculateTargetValue(null, value);
    let resultValue = value;

    if (convertedValue !== value) {
      resultValue = convertedValue;
      this.renderErrorMessage(errorMessage.initСorrectionValues);
    }

    return resultValue;
  }

  renderSlider() {
    const fragmentWithASlider = document.createDocumentFragment();
    const blockSlider = document.createElement('div');
    blockSlider.classList.add('meta-slider');
    blockSlider.style.backgroundColor = this.secondColor;

    const propDisplay = this.isRange ? '' : 'display:none';

    const HTMLBlock = `<div class="meta-slider__progress"></div>
    <button type="button" class="meta-slider__thumb meta-slider__thumb_left" style="background-color:${this.mainColor}; border-color:${this.colorBorderForThumb}; ${propDisplay}" data-value="">
      <span class="meta-slider__marker meta-slider__marker_left" style="background-color:${this.colorMarker}; color: ${this.colorTextForMarker}; border-color:${this.colorBorderForMarker}"></span>
    </button>
    <button type="button" class="meta-slider__thumb meta-slider__thumb_right" style="background-color:${this.mainColor}; border-color:${this.colorBorderForThumb}" data-value="">
      <span class="meta-slider__marker meta-slider__marker_right" style="background-color:${this.colorMarker}; color: ${this.colorTextForMarker}; border-color:${this.colorBorderForMarker}"></span>
    </button>`;

    blockSlider.innerHTML = HTMLBlock;

    fragmentWithASlider.append(blockSlider);
    this.selector.append(fragmentWithASlider);
  }

  initValuesCheck() {
    const errorMessage = {
      initValue: 'Ошибка во входящих данных для бегунков слайдера. Установлены значения по-умолчанию.',
      minAndMaxValue: 'Max значение установленное для слайдера меньше или равно его Min значению. Установлены значения по-умолчанию.',
      stepSizeForScale: 'Установите корректное значение шага для шкалы с делениями. Установлено ближайщее оптимальное значение.',
      step: 'Значение шага слайдера не может быть больше его макс.значения, а также меньше или равно 0.',
      initСorrectionValues: 'Входящие значения для бегунков скорректированны согласно установленному шагу.',
    };

    if (this.showTheScale) this.showMinAndMaxValue = false;
    if (this.showMinAndMaxValue) this.showTheScale = false;

    if (this.minValue > this.maxValue || this.minValue === this.maxValue) {
      this.minValue = 0;
      this.maxValue = 100;
      this.renderErrorMessage(errorMessage.minAndMaxValue);
    }

    if (this.checkedValueFirst > this.initValueSecond) {
      this.resetInitValue();
      this.renderErrorMessage(errorMessage.initValue);
    }

    if (this.step <= 0 || this.step > this.maxValue) {
      this.step = this.maxValue;
      this.renderErrorMessage(errorMessage.step);
    }

    if (this.stepSizeForScale <= 0 || this.stepSizeForScale > this.maxValue) {
      this.stepSizeForScale = this.maxValue;
      this.renderErrorMessage(errorMessage.stepSizeForScale);
    }

    if (this.initValueSecond > this.maxValue || this.checkedValueFirst > this.maxValue) {
      this.resetInitValue();
      this.renderErrorMessage(errorMessage.initValue);
    } else if (this.initValueSecond < this.minValue || this.checkedValueFirst < this.minValue) {
      this.resetInitValue();
      this.renderErrorMessage(errorMessage.initValue);
    }

    if (this.customValues.length > 0) {
      this.initCustomValues();
      this.minAndMaxValuesArray = [
        this.customValues[0],
        this.customValues[this.customValues.length - 1],
      ];
    } else {
      this.minAndMaxValuesArray = [this.minValue, this.maxValue];
    }

    if (this.checkingStepSizeForScale) {
      this.checkCorrectStepSizeForScale(errorMessage);
    }

    if (this.enableСorrectionValues) {
      this.checkedValueFirst = this.initValueCorrection(this.checkedValueFirst, errorMessage);
      this.initValueSecond = this.initValueCorrection(this.initValueSecond, errorMessage);
    }

    this.initValuesArray = [this.checkedValueFirst, this.initValueSecond];
  }

  getInfoAboutSlider() {
    this.elemSlider = this.selector.querySelector('.meta-slider');
    this.elemThumbs = this.elemSlider.querySelectorAll('.meta-slider__thumb');
    this.elemMarkers = this.elemSlider.querySelectorAll('.meta-slider__marker');
    this.sliderProgress = this.selector.querySelector('.meta-slider__progress');

    this.linkInitPointerMove = this.handleInitPointerMove.bind(this);
    this.linkInitPointerUp = this.handleInitPointerUp.bind(this);

    this.heightMarker = this.elemMarkers[1].offsetHeight;
    this.heightThumb = this.elemThumbs[1].offsetHeight;
  }

  setMinAndMaxValues() {
    this.elemSlider.style.marginBottom = '';
    this.elemSlider.dataset.min = this.minValue;
    this.elemSlider.dataset.max = this.maxValue;

    if (this.customValues.length > 0) {
      this.elemSlider.dataset.min_text = this.customValues[0];
      this.elemSlider.dataset.max_text = this.customValues[this.customValues.length - 1];
    }

    if (this.showMinAndMaxValue) {
      const HTMLBlockValues = `<button type="button" class="meta-slider__value meta-slider__value_min" style="color: ${this.colorTextForMinAndMaxValue}"></button>
      <button type="button" class="meta-slider__value meta-slider__value_max" style="color: ${this.colorTextForMinAndMaxValue}"></button>`;
      this.elemSlider.insertAdjacentHTML('beforeend', HTMLBlockValues);

      this.elemMinAndMaxValues = this.elemSlider.querySelectorAll('.meta-slider__value');

      this.elemMinAndMaxValues.forEach((elem, index) => {
        if (this.customValues.length === 0) {
          let convertedValue = this.enableFormatted
            ? this.minAndMaxValuesArray[index].toLocaleString()
            : this.minAndMaxValuesArray[index].toFixed(this.numberOfDecimalPlaces);

          elem.textContent = `${this.preFix}${convertedValue}${this.postFix}`;
        } else {
          elem.textContent = `${this.preFix}${this.minAndMaxValuesArray[index]}${this.postFix}`;
        }

        elem.dataset.value = this.minAndMaxValuesArray[index];
      });

      if (this.enableAutoMargins) this.elemSlider.style.marginBottom = (this.elemMinAndMaxValues[0].offsetHeight * 2) + 'px';
    }
  }

  createScaleOfValues() {
    if (!this.showMinAndMaxValue) this.elemSlider.style.marginBottom = '';

    if (this.showTheScale) {
      this.scalePointsSize = 0;
      this.mapSkipScalePoints = new Map();
      const fragmentWithScale = document.createDocumentFragment();
      const blockScale = document.createElement('div');
      const stepSizeValue = this.enableAutoScaleCreation
        ? this.step
        : this.stepSizeForScale;

      blockScale.classList.add('meta-slider__scale');
      this.elemSlider.append(blockScale);

      let currentScalePointValue = this.minValue;

      for (; currentScalePointValue <= this.maxValue; currentScalePointValue += stepSizeValue) {
        currentScalePointValue = Number(currentScalePointValue.toFixed(this.numberOfDecimalPlaces));

        const convertedScalePointValue = this.enableFormatted
          ? currentScalePointValue.toLocaleString()
          : currentScalePointValue;

        const resultScalePointValue = this.customValues.length > 0
          ? this.customValues[currentScalePointValue]
          : convertedScalePointValue;

        const elemScalePoint = `<button type="button" class="meta-slider__scale-point" data-value="${currentScalePointValue}">${this.preFix}${resultScalePointValue}${this.postFix}</button>`;

        blockScale.insertAdjacentHTML('beforeEnd', elemScalePoint);
        fragmentWithScale.append(blockScale);
      }

      this.elemSlider.append(fragmentWithScale);

      this.elemScalePoints = this.elemSlider.querySelectorAll('.meta-slider__scale-point');

      this.elemScalePoints.forEach(scalePoint => {
        const valueInScalePoint = scalePoint.dataset.value;
        const resultValue = (valueInScalePoint - this.minValue) / (this.maxValue - this.minValue);
        this.scalePointsSize += scalePoint.offsetWidth;

        scalePoint.style.left = (resultValue * 100) + '%';
      });

      if (this.enableAutoMargins) this.elemSlider.style.marginBottom = (this.elemScalePoints[0].offsetHeight * 3) + 'px';
    }
  }

  setValueForSlider(valuesArray) {
    let valuesAsPercentageArray = [];

    valuesArray.forEach((currentValue, index) => {
      const resultValue = (currentValue - this.minValue) / (this.maxValue - this.minValue);
      valuesAsPercentageArray.push(resultValue * 100);

      this.elemThumbs[index].style.left = valuesAsPercentageArray[index] + '%';
      this.elemThumbs[index].dataset.value = currentValue.toFixed(this.numberOfDecimalPlaces);

      if (this.customValues.length > 0) {
        this.elemThumbs[index].dataset.text = this.customValues[currentValue];
      }
    });

    this.setBackgroundTheRange(valuesAsPercentageArray);
    this.setValueInMarker();
  }

  setValueInMarker() {
    this.elemSlider.style.marginTop = '';
    this.elemMarkers.forEach(elem => {
      elem.style.display = 'none';
    });

    if (this.showMarkers) {
      if (this.enableAutoMargins) this.elemSlider.style.marginTop = (this.heightMarker + (this.heightThumb / 1.5)) + 'px';

      this.elemMarkers.forEach((marker, index) => {
        if (this.customValues.length > 0) {
          marker.textContent = `${this.preFix}${this.elemThumbs[index].dataset.text}${this.postFix}`;
        } else {
          const currentValue = this.elemThumbs[index].dataset.value;
          const currentValueAsNumber = Number(currentValue).toFixed(this.numberOfDecimalPlaces);
          const convertedValue = this.enableFormatted
            ? Number(currentValueAsNumber).toLocaleString()
            : currentValueAsNumber;

          marker.textContent = `${this.preFix}${convertedValue}${this.postFix}`;
        }
        marker.style.display = '';
      });
    }
  }

  setBackgroundTheRange(valuesAsPercentageArray) {
    if (this.showBackgroundForRange) {
      const settingForRange = `left: ${valuesAsPercentageArray[0]}%; right: ${100 - valuesAsPercentageArray[1]}%; background: ${this.mainColor};`;
      this.sliderProgress.style = settingForRange;
    }
  }

  checkTargetValue(targetValue, event) {
    const [firstThumb, secondThumb] = this.elemThumbs;
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
      if (event.target.classList.contains('meta-slider__thumb_left')) {
        this.initValuesArray[0] = targetValue;
      } else if (event.target.classList.contains('meta-slider__thumb_right')) {
        this.initValuesArray[1] = targetValue;
      }
    }

    this.setValueForSlider(this.initValuesArray);
  }

  calculateTargetValue(event, initValue) {
    let eventPosition;
    let sliderOffset;
    let sliderSize;
    let valueInEventPosition;

    if (this.isVertical && event) {
      eventPosition = event.clientY;
      sliderOffset = this.elemSlider.getBoundingClientRect().bottom;
      sliderSize = this.elemSlider.getBoundingClientRect().height;
      valueInEventPosition = sliderOffset - eventPosition;
    } else if (!this.isVertical && event) {
      eventPosition = event.clientX;
      sliderOffset = this.elemSlider.offsetLeft;
      sliderSize = this.elemSlider.getBoundingClientRect().width;
      valueInEventPosition = eventPosition - sliderOffset;
    }

    const valueAsPercentage = (initValue === undefined)
      ? (valueInEventPosition / sliderSize) * 100
      : ((initValue - this.minValue) / (this.maxValue - this.minValue)) * 100;

    const stepCounter = (this.maxValue - this.minValue) / this.step;
    const stepAsPercent = 100 / stepCounter;

    let totalPercent = Math.round(valueAsPercentage / stepAsPercent) * stepAsPercent;

    if (totalPercent < 0) totalPercent = 0;
    if (totalPercent > 100) totalPercent = 100;

    const resultValue = (totalPercent / stepAsPercent) * this.step;
    const targetValue = Number(resultValue.toFixed(this.numberOfDecimalPlaces)) + this.minValue;

    return targetValue;
  }

  setPropForSkipScalePoint(scalePoint) {
    scalePoint.classList.add('meta-slider__scale-point_skip');
    scalePoint.tabIndex = '-1';
    this.skipScalePointsArray.push(scalePoint);
  }

  checkingScaleSize() {
    if (this.showTheScale && this.enableScaleAdjustment) {
      const MARGIN_POINTS = 120;
      const sliderSize = this.elemSlider.offsetWidth;

      while (this.scalePointsSize + MARGIN_POINTS > sliderSize) {
        const totalWidthScalePoints = this.scalePointsSize + MARGIN_POINTS;
        this.skipScalePointsArray = [];

        this.elemScalePoints = this.elemSlider.querySelectorAll('.meta-slider__scale-point:not(.meta-slider__scale-point_skip)');
        this.scalePointsSize = 0;

        if (this.elemScalePoints.length <= 2) break;

        this.elemScalePoints.forEach((scalePoint, index, scalePointsArr) => {
          const firstOrLastIndex = (index === 0) || (index === scalePointsArr.length - 1);
          const intervalWithoutFirstAndLastIndex = !firstOrLastIndex && scalePointsArr.length <= 6;

          if (index % 2 !== 0 && scalePointsArr.length > 6) {
            this.setPropForSkipScalePoint(scalePoint);
          } else if ((scalePointsArr.length % 2 !== 0) && scalePointsArr.length <= 6) {
            this.setPropForSkipScalePoint(scalePoint);
          } else if ((scalePointsArr.length % 2 === 0) && intervalWithoutFirstAndLastIndex) {
            this.setPropForSkipScalePoint(scalePoint);
          }

          if (!scalePoint.classList.contains('meta-slider__scale-point_skip')) this.scalePointsSize += scalePoint.offsetWidth;
        });

        this.mapSkipScalePoints.set(totalWidthScalePoints, [...this.skipScalePointsArray]);
      }

      this.mapSkipScalePoints.forEach((scalePointSkipArray, controlSize) => {
        if (sliderSize > controlSize + MARGIN_POINTS) {
          scalePointSkipArray.forEach(scalePoint => {
            scalePoint.tabIndex = '';
            scalePoint.classList.remove('meta-slider__scale-point_skip');
            this.scalePointsSize += scalePoint.offsetWidth;
          });

          this.mapSkipScalePoints.delete(controlSize);
        }
      });
    }
  }

  handleGetValueInScalePoint(event) {
    event.preventDefault();
    const targetValue = Number(event.target.dataset.value);
    let calculateTargetValue = targetValue;

    if (!event.target.classList.contains('meta-slider__value')) {
      calculateTargetValue = this.enableСorrectionValues
        ? this.calculateTargetValue(null, targetValue)
        : targetValue;
    }

    this.checkTargetValue(calculateTargetValue, event);
  }

  handleSetPositionForThumbs(event) {
    event.preventDefault();
    if (event.target.classList.contains('meta-slider')) {
      const calculateTargetValue = this.calculateTargetValue(event);
      this.checkTargetValue(calculateTargetValue, event);
    }
  }

  handleChangeThumbPosition(event) {
    const configEventCode = (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'ArrowUp' || event.code === 'ArrowDown');
    if (configEventCode) {
      let eventTargetValue = Number(event.target.dataset.value);
      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') event.preventDefault();
      if (event.code === 'ArrowLeft' || event.code === 'ArrowDown') eventTargetValue -= this.step;
      if (event.code === 'ArrowRight' || event.code === 'ArrowUp') eventTargetValue += this.step;

      const calculateTargetValue = this.calculateTargetValue(null, eventTargetValue);
      this.checkTargetValue(calculateTargetValue, event);
    }
  }

  handleInitPointerMove(event) {
    const calculateTargetValue = this.calculateTargetValue(event);

    this.checkTargetValue(calculateTargetValue, event);
  }

  handleInitPointerUp(event) {
    event.target.removeEventListener('pointermove', this.linkInitPointerMove);
    event.target.removeEventListener('pointerup', this.linkInitPointerUp);
  }

  handleSetEventListenerForThumbs(event) {
    event.target.setPointerCapture(event.pointerId);
    event.target.addEventListener('pointermove', this.linkInitPointerMove);
    event.target.addEventListener('pointerup', this.linkInitPointerUp);
  }

  handleRemoveErrorWindow() {
    this.elemErrorInfo.remove();
  }

  handleCheckingScaleSize() {
    this.checkingScaleSize();
  }

  setEventsSlider() {
    if (this.elemScalePoints) {
      this.elemScalePoints.forEach(elemPoint => {
        elemPoint.addEventListener('click', this.handleGetValueInScalePoint.bind(this));
      });
    }

    if (this.elemMinAndMaxValues) {
      this.elemMinAndMaxValues.forEach(elem => {
        elem.addEventListener('click', this.handleGetValueInScalePoint.bind(this));
      });
    }

    if (this.btnErrorClose) {
      this.btnErrorClose.addEventListener('click', this.handleRemoveErrorWindow.bind(this));
    }

    this.elemSlider.addEventListener('pointerdown', this.handleSetPositionForThumbs.bind(this));
  }

  setEventsThumbs() {
    this.elemThumbs.forEach(thumb => {
      thumb.addEventListener('pointerdown', this.handleSetEventListenerForThumbs.bind(this));
      thumb.addEventListener('keydown', this.handleChangeThumbPosition.bind(this));
      // eslint-disable-next-line fsd/no-function-declaration-in-event-listener
      thumb.addEventListener('dragstart', () => false);
    });
  }

  setEventsWindow() {
    if (this.showTheScale && this.enableScaleAdjustment) {
      window.addEventListener('resize', this.handleCheckingScaleSize.bind(this));
    }
  }
}

export default MetaSlider;
