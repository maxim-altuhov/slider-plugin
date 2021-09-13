class MetaSlider {
  selector = document.querySelector('#slider');

  mainColor = '#6d6dff';
  secondColor = '#e4e4e4';
  colorMarker = this.mainColor;
  colorTextForMarker = '#ffffff'
  colorBorderForMarker = '#ffffff'
  colorBorderForThumb = '#ffffff'
  colorTextForMinAndMaxValue = '#000000'
  colorForScale = '#000000'

  enableСorrectionValues = true;
  enableFormatted = true;
  enableAutoMargins = true;
  showError = true;
  showMinAndMaxValue = false;
  showTheScale = true;
  showMarkers = true;
  showBackgroundForRange = true;
  isRange = false;
  enableAutoScaleCreation = false;
  checkStepSizeForScale = !this.enableAutoScaleCreation;

  step = 1;
  minValue = 0;
  maxValue = 100;
  stepSizeForScale = 5;
  numberOfDecimalPlaces = this.getNumberOfDecimalPlaces();
  preFix = '';
  postFix = '';
  // 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'
  customValues = [];
  initValueLeft = 0;
  initValueRight = 50;
  checkedInitValueLeft = this.isRange ? this.initValueLeft : this.minValue;

  constructor() {
    this.renderSlider();
    this.getInfoAboutSlider();
    this.initValuesCheck();
    this.init();
  }

  init() {
    this.setValueForSlider(this.initValuesArray);
    this.setMinAndMaxValues();
    this.createScaleOfValues();
    this.setEventsSlider();
    this.setEventsThumbs();
  }

  checkIsIntegerStepSizeForScale() {
    return Number.isInteger((this.maxValue - this.minValue) / this.stepSizeForScale);
  }

  getNumberOfDecimalPlaces() {
    return this.step.toString().includes('.') ? this.step.toString().match(/\.(\d+)/)[1].length : 0;
  }

  renderErrorMessage(message) {
    if (this.showError) {
      this.elemErrorInfo.classList.remove('error-info__hidden');
      this.elemErrorInfoText.textContent = message;
    }
  }

  resetInitValue() {
    this.initValueRight = this.maxValue;
    this.checkedInitValueLeft = this.minValue;
  }

  initCustomValues() {
    this.minValue = 0;
    this.maxValue = this.customValues.length - 1;
    this.enableAutoScaleCreation = false;
    this.checkStepSizeForScale = false;
    this.enableFormatted = false;
    this.enableСorrectionValues = true;
    this.numberOfDecimalPlaces = 0;
    this.step = 1;
    this.stepSizeForScale = 1;
  }

  checkCorrectStepSizeForScale(errorMessage) {
    while (!this.checkIsIntegerStepSizeForScale() || this.stepSizeForScale <= 0) {
      if (this.stepSizeForScale > 1 && Number.isInteger(this.stepSizeForScale)) {
        this.stepSizeForScale += 1;
      } else if (this.stepSizeForScale <= 0) {
        this.stepSizeForScale = 1;
      } else if (!Number.isInteger(this.stepSizeForScale)) {
        this.stepSizeForScale += 0.1;
        this.stepSizeForScale = Number(this.stepSizeForScale.toFixed(1));
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

  initValuesCheck() {
    const errorMessage = {
      initValue: 'Ошибка во входящих данных для бегунков слайдеров. Установлены значения по-умолчанию.',
      minAndMaxValue: 'Max значение установленное для слайдера меньше или равно его Min значению. Установлены значения по-умолчанию.',
      stepSizeForScale: 'Установите корректное значение шага для шкалы с делениями. Установлено ближайщее оптимальное значение.',
      step: 'Значение шага слайдера не может быть меньше или равно 0.',
      initСorrectionValues: 'Входящие значения для бегунков скорректированны кратно установленному шагу.',
    };

    if (this.step <= 0) {
      this.step = 1;
      this.renderErrorMessage(errorMessage.step);
    }

    if (this.checkedInitValueLeft > this.initValueRight) {
      this.resetInitValue();
      this.renderErrorMessage(errorMessage.initValue);
    }

    if (this.minValue > this.maxValue || this.minValue === this.maxValue) {
      this.minValue = 0;
      this.maxValue = 100;
      this.renderErrorMessage(errorMessage.minAndMaxValue);
    }

    if (this.initValueRight > this.maxValue || this.checkedInitValueLeft > this.maxValue) {
      this.resetInitValue();
      this.renderErrorMessage(errorMessage.initValue);
    } else if (this.initValueRight < this.minValue || this.checkedInitValueLeft < this.minValue) {
      this.resetInitValue();
      this.renderErrorMessage(errorMessage.initValue);
    }

    if (this.stepSizeForScale > this.maxValue) {
      this.stepSizeForScale = this.maxValue;
      this.renderErrorMessage(errorMessage.stepSizeForScale);
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

    if (this.checkStepSizeForScale) {
      this.checkCorrectStepSizeForScale(errorMessage);
    }

    this.stepCounter = (this.maxValue - this.minValue) / this.step;
    this.stepAsPercent = 100 / this.stepCounter;

    if (this.enableСorrectionValues) {
      this.checkedInitValueLeft = this.initValueCorrection(this.checkedInitValueLeft, errorMessage);
      this.initValueRight = this.initValueCorrection(this.initValueRight, errorMessage);
    }

    this.initValuesArray = [this.checkedInitValueLeft, this.initValueRight];
  }

  renderSlider() {
    const fragmentWithASlider = document.createDocumentFragment();
    const blockSlider = document.createElement('div');
    blockSlider.classList.add('meta-slider');
    blockSlider.style.backgroundColor = this.secondColor;

    const propDisplay = this.isRange ? '' : 'display:none';

    const HTMLBlock = `<div class="error-info error-info__hidden"><p class="error-info__text"></p><button type="button" class="error-info__close">X</button></div>
    <div class="meta-slider__progress"></div>
    <button type="button" class="meta-slider__value meta-slider__value_min" style="color: ${this.colorTextForMinAndMaxValue}"></button>
    <button type="button" class="meta-slider__thumb meta-slider__thumb_left" style="background-color:${this.mainColor}; border-color:${this.colorBorderForThumb}; ${propDisplay}" data-value="">
      <span class="meta-slider__marker meta-slider__marker_left" style="background-color:${this.colorMarker}; color: ${this.colorTextForMarker}; border-color:${this.colorBorderForMarker}"></span>
    </button>
    <button type="button" class="meta-slider__thumb meta-slider__thumb_right" style="background-color:${this.mainColor}; border-color:${this.colorBorderForThumb}" data-value="">
      <span class="meta-slider__marker meta-slider__marker_right" style="background-color:${this.colorMarker}; color: ${this.colorTextForMarker}; border-color:${this.colorBorderForMarker}"></span>
    </button>
    <button type="button" class="meta-slider__value meta-slider__value_max" style="color: ${this.colorTextForMinAndMaxValue}"></button>`;

    blockSlider.innerHTML = HTMLBlock;

    fragmentWithASlider.append(blockSlider);
    this.selector.append(fragmentWithASlider);
  }

  getInfoAboutSlider() {
    this.elemSlider = this.selector.querySelector('.meta-slider');

    this.sliderProgress = this.selector.querySelector('.meta-slider__progress');

    this.elemScalePoints = document.querySelectorAll('.meta-slider__scale-point');

    this.elemThumbs = this.elemSlider.querySelectorAll('.meta-slider__thumb');
    this.elemMarkers = this.elemSlider.querySelectorAll('.meta-slider__marker');
    this.elemMinAndMaxValues = this.elemSlider.querySelectorAll('.meta-slider__value');

    this.elemErrorInfo = this.selector.querySelector('.error-info');
    this.elemErrorInfoText = this.selector.querySelector('.error-info__text');
    this.btnErrorClose = this.selector.querySelector('.error-info__close');

    this.linkInitPointerMove = this.handleInitPointerMove.bind(this);
    this.linkInitPointerUp = this.handleInitPointerUp.bind(this);

    this.widthSlider = this.elemSlider.getBoundingClientRect().width;
    this.heightMarker = this.elemMarkers[1].offsetHeight;
    this.widthThumb = this.elemThumbs[1].offsetWidth;
    this.heightThumb = this.elemThumbs[1].offsetHeight;
    this.thumbHalfWidthAsPercentage = ((this.widthThumb / 2) / this.widthSlider) * 100;
  }

  setMinAndMaxValues() {
    if (this.enableAutoMargins) this.elemSlider.style.marginBottom = '';

    this.elemSlider.dataset.min = this.minValue;
    this.elemSlider.dataset.max = this.maxValue;

    if (this.customValues.length > 0) {
      this.elemSlider.dataset.min_text = this.customValues[0];
      this.elemSlider.dataset.max_text = this.customValues[this.customValues.length - 1];
    }

    if (this.showMinAndMaxValue && !this.showTheScale) {
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

      if (this.enableAutoMargins) this.elemSlider.style.marginBottom = (this.elemMinAndMaxValues[0].offsetHeight * 3) + 'px';
    }
  }

  createScaleOfValues() {
    if (this.enableAutoMargins && !this.showMinAndMaxValue) this.elemSlider.style.marginBottom = '';

    if (this.showTheScale) {
      const fragmentWithScale = document.createDocumentFragment();
      const blockScale = document.createElement('div');
      const stepSizeValue = this.step >= 5 && this.enableAutoScaleCreation
        ? this.step
        : this.stepSizeForScale;

      blockScale.classList.add('meta-slider__scale');
      this.elemSlider.append(blockScale);

      let currentScalePointValue = this.minValue;

      for (; currentScalePointValue <= this.maxValue; currentScalePointValue += stepSizeValue) {
        const convertedScalePointValue = this.enableFormatted
          ? currentScalePointValue.toLocaleString()
          : currentScalePointValue.toFixed(this.numberOfDecimalPlaces);

        const resultScalePointValue = this.customValues.length > 0
          ? this.customValues[currentScalePointValue]
          : convertedScalePointValue;

        const elemScalePoint = `<button type="button" class="meta-slider__scale-point" data-value="${currentScalePointValue.toFixed(this.numberOfDecimalPlaces)}" style="color: ${this.colorForScale};">${this.preFix}${resultScalePointValue}${this.postFix}</button>`;

        blockScale.insertAdjacentHTML('beforeEnd', elemScalePoint);
        fragmentWithScale.append(blockScale);
      }

      this.elemSlider.append(fragmentWithScale);

      this.elemScalePoints = document.querySelectorAll('.meta-slider__scale-point');

      this.elemScalePoints.forEach(scalePoint => {
        const valueInScalePoint = scalePoint.dataset.value;
        const resultValue = (valueInScalePoint - this.minValue) / (this.maxValue - this.minValue);

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

      this.elemThumbs[index].style.left = (valuesAsPercentageArray[index] - this.thumbHalfWidthAsPercentage) + '%';
      this.elemThumbs[index].dataset.value = currentValue.toFixed(this.numberOfDecimalPlaces);

      if (this.customValues.length > 0) {
        this.elemThumbs[index].dataset.text = this.customValues[currentValue];
      }
    });

    this.setBackgroundTheRange(valuesAsPercentageArray);
    this.setValueInMarker();
  }

  setValueInMarker() {
    if (this.enableAutoMargins) this.elemSlider.style.marginTop = '';

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
    const [leftThumb, rightThumb] = this.elemThumbs;
    const currentLeftVal = Number(leftThumb.dataset.value);
    const currentRightVal = Number(rightThumb.dataset.value);
    const leftThumbDiff = Math.abs((targetValue - currentLeftVal).toFixed(2));
    const rightThumbDiff = Math.abs((targetValue - currentRightVal).toFixed(2));
    let clickInRange = false;

    if (this.isRange) clickInRange = targetValue > currentLeftVal && targetValue < currentRightVal;

    if (targetValue <= currentLeftVal) this.initValuesArray[0] = targetValue;
    if (targetValue >= currentRightVal || !this.isRange) this.initValuesArray[1] = targetValue;

    if (clickInRange && leftThumbDiff < rightThumbDiff) {
      this.initValuesArray[0] = targetValue;
    } else if (clickInRange && leftThumbDiff > rightThumbDiff) {
      this.initValuesArray[1] = targetValue;
    }

    const isIdenticalDistanceInRange = (clickInRange && leftThumbDiff === rightThumbDiff);
    const isEventMoveKeypress = (event.code === 'ArrowLeft' || event.code === 'ArrowRight');

    if (isIdenticalDistanceInRange && !isEventMoveKeypress) {
      const leftThumbPosition = leftThumb.getBoundingClientRect().left;
      const rightThumbPosition = rightThumb.getBoundingClientRect().right;
      const leftValuePosition = Math.abs(event.clientX - leftThumbPosition);
      const rightValuePosition = Math.abs(event.clientX - rightThumbPosition);

      if (Math.round(rightValuePosition - leftValuePosition) >= 0) {
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
    const valueInEventPosition = event ? event.clientX - this.elemSlider.offsetLeft : undefined;
    const valueAsPercentage = (initValue === undefined)
      ? (valueInEventPosition / this.widthSlider) * 100
      : ((initValue - this.minValue) / (this.maxValue - this.minValue)) * 100;

    let totalPercent = Math.round(valueAsPercentage / this.stepAsPercent) * this.stepAsPercent;

    if (totalPercent < 0) totalPercent = 0;
    if (totalPercent > 100) totalPercent = 100;

    let resultValue = (totalPercent / this.stepAsPercent) * this.step;
    const targetValue = Number(resultValue.toFixed(this.numberOfDecimalPlaces)) + this.minValue;

    return targetValue;
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
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      let eventTargetValue = Number(event.target.dataset.value);
      if (event.code === 'ArrowLeft') eventTargetValue -= this.step;
      if (event.code === 'ArrowRight') eventTargetValue += this.step;

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

  handleCloseErrorWindow() {
    this.elemErrorInfo.classList.add('error-info__hidden');
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

    this.btnErrorClose.addEventListener('click', this.handleCloseErrorWindow.bind(this));
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
}

export default MetaSlider;
