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

  enableAutoMargins = true;
  showError = true;
  showMinAndMaxValue = false;
  showTheScale = true;
  showMarkers = true;
  showBackgroundForRange = true;
  isRange = true;
  enableAutoScaleCreation = false;
  checkStepSizeForScale = !this.enableAutoScaleCreation;

  step = 10;
  minValue = 0;
  maxValue = 100;
  stepSizeForScale = 10;
  numberOfDecimalPlaces = this.step < 1 ? 1 : 0;
  preFix = '';
  postFix = '';

  initValueLeft = 10;
  initValueRight = 20;
  checkedInitValueLeft = this.isRange ? this.initValueLeft : this.minValue;
  initValuesArray;
  minAndMaxValuesArray;

  constructor() {
    this.renderSlider();
    this.getInfoAboutSlider();
    this.initValueCheck();
    this.init();
  }

  init() {
    this.setValueForThumbs(this.initValuesArray);
    this.setMinAndMaxValues();
    this.createScaleOfValues();
    this.setEventsSlider();
    this.setEventsThumbs();
  }

  checkCorrectStepSizeForScale() {
    return Number.isInteger((this.maxValue - this.minValue) / this.stepSizeForScale);
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

  initValueCheck() {
    const errorMessage = {
      initValue: 'Ошибка во входящих данных для бегунков слайдеров. Установлены значения по-умолчанию.',
      minAndMaxValue: 'Max значение установленное для слайдера меньше или равно его Min значению. Установлены значения по-умолчанию.',
      stepSizeForScale: 'Установите корректное значение шага для шкалы с делениями. Установлено ближайщее оптимальное значение.',
      step: 'Значение шага слайдера не может быть меньше или равно 0.',
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

    if (this.checkStepSizeForScale) {
      while (!this.checkCorrectStepSizeForScale() || this.stepSizeForScale <= 0) {
        if (this.stepSizeForScale > 1 || this.stepSizeForScale <= 0) {
          this.stepSizeForScale += 1;
        } else {
          this.stepSizeForScale += 0.1;
        }
        this.renderErrorMessage(errorMessage.stepSizeForScale);
      }
    }

    this.minAndMaxValuesArray = [this.minValue, this.maxValue];
    this.initValuesArray = [this.checkedInitValueLeft, this.initValueRight];
  }

  renderSlider() {
    const fragmentWithASlider = document.createDocumentFragment();
    const blockSlider = document.createElement('div');
    blockSlider.classList.add('meta-slider');
    blockSlider.style.backgroundColor = this.secondColor;

    blockSlider.dataset.min = this.minValue;
    blockSlider.dataset.max = this.maxValue;

    const propDisplay = this.isRange ? 'display:block' : 'display:none';

    const HTMLBlock = `<div class="error-info error-info__hidden"><p class="error-info__text"></p><span class="error-info__close">X</span></div>
    <div class="meta-slider__progress"></div>
    <span class="meta-slider__value meta-slider__value_min" style="color: ${this.colorTextForMinAndMaxValue}"></span>
    <button class="meta-slider__thumb meta-slider__thumb_left" style="background-color:${this.mainColor}; border-color:${this.colorBorderForThumb}; ${propDisplay}" data-value="">
      <span class="meta-slider__marker meta-slider__marker_left" style="background-color:${this.colorMarker}; color: ${this.colorTextForMarker};
       border-color:${this.colorBorderForMarker}"></span>
    </button>
    <button class="meta-slider__thumb meta-slider__thumb_right" style="background-color:${this.mainColor}; border-color:${this.colorBorderForThumb}" data-value="">
      <span class="meta-slider__marker meta-slider__marker_right" style="background-color:${this.colorMarker}; color: ${this.colorTextForMarker};
       border-color:${this.colorBorderForMarker}"></span>
    </button>
    <span class="meta-slider__value meta-slider__value_max" style="color: ${this.colorTextForMinAndMaxValue}"></span>`;

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
    this.elemWithMinValue = this.elemSlider.querySelector('.meta-slider__value_min');
    this.elemWithMaxValue = this.elemSlider.querySelector('.meta-slider__value_max');

    this.elemErrorInfo = this.selector.querySelector('.error-info');
    this.elemErrorInfoText = this.selector.querySelector('.error-info__text');
    this.btnErrorClose = this.selector.querySelector('.error-info__close');

    this.linkInitMouseMove = this.handleInitMouseMove.bind(this);
    this.linkInitMouseUp = this.handleInitMouseUp.bind(this);

    this.widthSlider = this.elemSlider.offsetWidth;
    this.heightMarker = this.elemMarkers[1].offsetHeight;
    this.widthThumb = this.elemThumbs[1].offsetWidth;
    this.heightThumb = this.elemThumbs[1].offsetHeight;
    this.thumbWidthAsPercentage = ((this.widthThumb / 2) / this.widthSlider) * 100;
    this.stepCounter = (this.maxValue - this.minValue) / this.step;
    this.stepAsPercentage = 100 / this.stepCounter;
  }

  setMinAndMaxValues() {
    if (this.enableAutoMargins) this.elemSlider.style.marginBottom = '';

    if (this.showMinAndMaxValue && !this.showTheScale) {
      this.elemMinAndMaxValues.forEach((elem, index) => {
        elem.textContent = `${this.preFix}${this.minAndMaxValuesArray[index]}${this.postFix}`;
        const valueOffset = ((elem.offsetWidth / 2) / this.widthSlider) * 100;

        if (index === 0) {
          elem.style.left = (-valueOffset) + '%';
        } else {
          elem.style.right = (-valueOffset) + '%';
        }
      });

      if (this.enableAutoMargins) this.elemSlider.style.marginBottom = (this.elemMinAndMaxValues[0].offsetHeight * 3) + 'px';
    }
  }

  createScaleOfValues() {
    if (this.enableAutoMargins && !this.showMinAndMaxValue) this.elemSlider.style.marginBottom = '';

    if (this.showTheScale) {
      const fragmentWithScale = document.createDocumentFragment();
      const blockScale = document.createElement('div');
      const stepSizeValue = (this.step >= 5 && this.enableAutoScaleCreation) ? this.step : this.stepSizeForScale;
      blockScale.classList.add('meta-slider__scale');

      for (let currentScalePointValue = this.minValue; currentScalePointValue <= this.maxValue; currentScalePointValue += stepSizeValue) {
        const elemScalePoint = document.createElement('button');
        elemScalePoint.classList.add('meta-slider__scale-point');
        elemScalePoint.style.color = this.colorForScale;
        elemScalePoint.dataset.value = currentScalePointValue;
        elemScalePoint.textContent = `${this.preFix}${currentScalePointValue}${this.postFix}`;

        blockScale.append(elemScalePoint);
      }

      fragmentWithScale.append(blockScale);
      this.elemSlider.append(fragmentWithScale);

      this.elemScalePoints = document.querySelectorAll('.meta-slider__scale-point');

      this.elemScalePoints.forEach((scalePoint) => {
        const valueInScalePoint = scalePoint.dataset.value;
        const currentValueAsPercentage = ((valueInScalePoint - this.minValue) / (this.maxValue - this.minValue)) * 100;
        const widthScalePointAsPercentage = ((scalePoint.offsetWidth / 2) / this.widthSlider) * 100;

        scalePoint.style.left = (currentValueAsPercentage - widthScalePointAsPercentage) + '%';
      });

      if (this.enableAutoMargins) this.elemSlider.style.marginBottom = (this.elemScalePoints[0].offsetHeight * 3) + 'px';
    }
  }

  setValueInMarker(valuesArray) {
    if (this.enableAutoMargins) this.elemSlider.style.marginTop = '';

    this.elemMarkers.forEach(elem => {
      elem.style.display = 'none';
    });

    if (this.showMarkers) {
      if (this.enableAutoMargins) this.elemSlider.style.marginTop = (this.heightMarker + (this.heightThumb / 2)) + 'px';

      valuesArray.forEach((currentValue, index) => {
        this.elemMarkers[index].textContent = `${this.preFix}${currentValue.toFixed(this.numberOfDecimalPlaces)}${this.postFix}`;
        this.elemMarkers[index].style.display = '';
      });
    }
  }

  setBackgroundTheRange(valuesAsPercentageArray) {
    if (this.showBackgroundForRange) {
      const settingForRange = `left: ${valuesAsPercentageArray[0]}%; right: ${100 - valuesAsPercentageArray[1]}%; background: ${this.mainColor};`;
      this.sliderProgress.style = settingForRange;
    }
  }

  setValueForSlider(valuesArray, valuesAsPercentageArray) {
    valuesArray.forEach((currentValue, index) => {
      this.elemThumbs[index].dataset.value = currentValue.toFixed(this.numberOfDecimalPlaces);
      this.elemThumbs[index].style.left = (valuesAsPercentageArray[index] - this.thumbWidthAsPercentage) + '%';
    });
    this.setBackgroundTheRange(valuesAsPercentageArray);
    this.setValueInMarker(valuesArray);
  }

  setValueForThumbs(valuesArray) {
    let valuesAsPercentageArray = [];
    valuesArray.forEach(currentValue => {
      const currentValueAsPersentage = ((currentValue - this.minValue) / (this.maxValue - this.minValue)) * 100;
      valuesAsPercentageArray.push(currentValueAsPersentage);
    });

    this.setValueForSlider(valuesArray, valuesAsPercentageArray);
  }

  setEventTargetValue(targetValue, event) {
    const [leftValue, rightValue] = this.elemThumbs;
    const currentLeftValue = Number(leftValue.dataset.value);
    const currentRightValue = Number(rightValue.dataset.value);

    const leftThumbDiff = Math.abs(targetValue - currentLeftValue);
    const rightThumbDiff = Math.abs(targetValue - currentRightValue);
    const clickInRange = this.isRange ? targetValue > currentLeftValue && targetValue < currentRightValue : false;

    if (targetValue <= currentLeftValue) this.initValuesArray[0] = targetValue;
    if (targetValue >= currentRightValue || !this.isRange) this.initValuesArray[1] = targetValue;

    if (clickInRange && leftThumbDiff < rightThumbDiff) {
      this.initValuesArray[0] = targetValue;
    } else if (clickInRange && leftThumbDiff > rightThumbDiff) {
      this.initValuesArray[1] = targetValue;
    }

    const identicalDistanceInRange = (clickInRange && leftThumbDiff === rightThumbDiff);

    if (identicalDistanceInRange) {
      const thumbLeftPosition = leftValue.getBoundingClientRect().left;
      const thumbRightPosition = rightValue.getBoundingClientRect().left;
      const leftValuePosition = Math.abs(event.clientX - thumbLeftPosition);
      const rightValuePosition = Math.abs(event.clientX - thumbRightPosition);

      if (Math.round(rightValuePosition - leftValuePosition) >= 0) {
        this.initValuesArray[0] = targetValue;
      } else {
        this.initValuesArray[1] = targetValue;
      }
    }

    this.setValueForThumbs(this.initValuesArray);
  }

  setValueWhenClickingOnTheScale(event) {
    event.preventDefault();
    const targetValue = Number(event.target.dataset.value);

    this.setEventTargetValue(targetValue, event);
  }

  calculateTargetValue(event) {
    const valuePosition = event.clientX - this.elemSlider.offsetLeft;
    const valueAsPercentage = (valuePosition / this.widthSlider) * 100;
    let stepFromLeftSide = Math.round(valueAsPercentage / this.stepAsPercentage) * this.stepAsPercentage;
    if (stepFromLeftSide < 0) stepFromLeftSide = 0;
    if (stepFromLeftSide > 100) stepFromLeftSide = 100;

    let calculateValue = Number((((stepFromLeftSide / this.stepAsPercentage) * this.step).toFixed(this.numberOfDecimalPlaces)));
    const targetValue = calculateValue + this.minValue;
    return targetValue;
  }

  handleSetPositionForThumbs(event) {
    event.preventDefault();
    if (event.target.classList.contains('meta-slider')) {
      this.setEventTargetValue(this.calculateTargetValue(event), event);
    }
  }

  handleInitMouseMove(event) {
    event.preventDefault();
    this.setEventTargetValue(this.calculateTargetValue(event), event);
  }

  handleInitMouseUp() {
    document.removeEventListener('mousemove', this.linkInitMouseMove);
    document.removeEventListener('mouseup', this.linkInitMouseUp);
  }

  handleSetEventListenerDoc(event) {
    event.preventDefault();

    document.addEventListener('mousemove', this.linkInitMouseMove);
    document.addEventListener('mouseup', this.linkInitMouseUp);
  }

  handleCloseErrorWindow() {
    this.elemErrorInfo.classList.add('error-info__hidden');
  }

  setEventsSlider() {
    if (this.elemScalePoints) {
      this.elemScalePoints.forEach(elemPoint => {
        elemPoint.addEventListener('click', this.setValueWhenClickingOnTheScale.bind(this));
      });
    }
    this.btnErrorClose.addEventListener('click', this.handleCloseErrorWindow.bind(this));
    this.elemSlider.addEventListener('mousedown', this.handleSetPositionForThumbs.bind(this));
  }

  setEventsThumbs() {
    this.elemThumbs.forEach(thumb => {
      thumb.addEventListener('mousedown', this.handleSetEventListenerDoc.bind(this));
      // eslint-disable-next-line fsd/no-function-declaration-in-event-listener
      thumb.addEventListener('dragstart', () => false);
    });
  }
}

export default MetaSlider;
