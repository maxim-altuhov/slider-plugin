class MetaSlider {
  selector = document.querySelector('#slider');

  mainColor = '#6d6dff';
  secondColor = '#e4e4e4';
  colorMarker = this.mainColor;
  colorTextForMarker = '#ffffff'
  colorForScale = '#000000'

  showError = true;
  showMinAndMaxValue = false;
  showTheScale = true;
  showMarkers = true;
  showBackgroundForRange = true;
  isRange = true;

  minValue = -100;
  maxValue = 100;
  numberOfDivisions = 10;

  initValueLeft = 0;
  initValueRight = 50;
  checkedInitValueLeft = this.isRange ? this.initValueLeft : this.minValue;
  initValuesArray;

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

  checkCorrectNumberOfDivisions() {
    return Number.isInteger((this.maxValue - this.minValue) / this.numberOfDivisions);
  }

  renderErrorMessage(message) {
    if (this.showError) {
      const elemErrorInfo = document.createElement('p');
      elemErrorInfo.classList.add('error-info');
      this.selector.append(elemErrorInfo);
      elemErrorInfo.textContent = message;
    }
  }

  resetInitValue() {
    this.initValueRight = this.maxValue;
    this.checkedInitValueLeft = this.minValue;
  }

  initValueCheck() {
    const errorMessage = {
      initValue: 'Ошибка во входящих данных для бегунков слайдеров. Установлены значения по-умолчанию',
      minAndMaxValue: 'Ошибка во входящих данных: Max значение установленное для слайдера меньше или равно его Min значению!',
      numberOfDivisions: 'Установите корректное значение кол-ва интервалов для отображения шкалы с делениями. Установлено ближайщее оптимальное значение.',
    };
    let showError = true;

    if (this.checkedInitValueLeft > this.initValueRight) {
      this.resetInitValue();
      this.renderErrorMessage(errorMessage.initValue);
    }

    if (this.minValue > this.maxValue || this.minValue === this.maxValue) {
      this.renderErrorMessage(errorMessage.minAndMaxValue);
    }

    if (this.initValueRight > this.maxValue || this.checkedInitValueLeft > this.maxValue) {
      this.resetInitValue();
      this.renderErrorMessage(errorMessage.initValue);
    } else if (this.initValueRight < this.minValue || this.checkedInitValueLeft < this.minValue) {
      this.resetInitValue();
      this.renderErrorMessage(errorMessage.initValue);
    }

    while (!this.checkCorrectNumberOfDivisions() || this.numberOfDivisions <= 0) {
      this.numberOfDivisions += 1;
      if (showError) this.renderErrorMessage(errorMessage.numberOfDivisions);
      showError = false;
    }

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

    const HTMLBlock = `<div class="meta-slider__progress"></div>
    <span class="meta-slider__value meta-slider__value_min"></span>
    <button class="meta-slider__thumb meta-slider__thumb_left" style="background-color:${this.mainColor}; ${propDisplay}" data-value="">
      <span class="meta-slider__marker meta-slider__marker_left" style="background-color:${this.colorMarker}; color: ${this.colorTextForMarker}; display:none"></span>
    </button>
    <button class="meta-slider__thumb meta-slider__thumb_right" style="background-color:${this.mainColor}" data-value="">
      <span class="meta-slider__marker meta-slider__marker_right" style="background-color:${this.colorMarker}; color: ${this.colorTextForMarker}; display:none"></span>
    </button>
    <span class="meta-slider__value meta-slider__value_max"></span>`;

    blockSlider.innerHTML = HTMLBlock;

    fragmentWithASlider.append(blockSlider);
    this.selector.append(fragmentWithASlider);
  }

  getInfoAboutSlider() {
    this.elemSlider = this.selector.querySelector('.meta-slider');

    this.sliderProgress = this.selector.querySelector('.meta-slider__progress');

    this.elemThumbs = this.elemSlider.querySelectorAll('.meta-slider__thumb');
    this.elemMarkers = this.elemSlider.querySelectorAll('.meta-slider__marker');

    this.elemWithMinValue = this.elemSlider.querySelector('.meta-slider__value_min');
    this.elemWithMaxValue = this.elemSlider.querySelector('.meta-slider__value_max');

    this.linkInitMouseMove = this.handleInitMouseMove.bind(this);
    this.linkInitMouseUp = this.handleInitMouseUp.bind(this);

    this.widthSlider = this.elemSlider.offsetWidth;
    this.widthThumb = this.elemThumbs[1].offsetWidth;
    this.thumbWidthAsPercentage = ((this.widthThumb / 2) / this.widthSlider) * 100;
  }

  setMinAndMaxValues() {
    if (this.showMinAndMaxValue) {
      this.elemWithMinValue.textContent = this.minValue;
      this.elemWithMaxValue.textContent = this.maxValue;
      const minValueOffset = ((this.elemWithMinValue.offsetWidth / 2) / this.widthSlider) * 100;
      const maxValueOffset = ((this.elemWithMaxValue.offsetWidth / 2) / this.widthSlider) * 100;

      this.elemWithMinValue.style.left = (-minValueOffset) + '%';
      this.elemWithMaxValue.style.right = (-maxValueOffset) + '%';

      this.elemSlider.style.marginBottom = '45px';
    }
  }

  createScaleOfValues() {
    if (this.showTheScale && !this.showMinAndMaxValue) {
      const fragmentWithScale = document.createDocumentFragment();
      const blockScale = document.createElement('div');
      const stepValueScale = (this.maxValue - this.minValue) / this.numberOfDivisions;
      let currentScalePointValue;

      blockScale.classList.add('meta-slider__scale');

      for (let i = 0; i < (this.numberOfDivisions + 1); i++) {
        if (i === 0) {
          currentScalePointValue = this.minValue;
        } else if (i === (this.numberOfDivisions + 1)) {
          currentScalePointValue = this.maxValue;
        } else {
          currentScalePointValue += stepValueScale;
        }

        const elemScalePoint = document.createElement('button');
        elemScalePoint.classList.add('meta-slider__scale-point');
        elemScalePoint.style.color = this.colorForScale;
        elemScalePoint.textContent = currentScalePointValue;

        blockScale.append(elemScalePoint);
      }
      fragmentWithScale.append(blockScale);
      this.elemSlider.appendChild(fragmentWithScale);

      const resultArrayScalePoint = document.querySelectorAll('.meta-slider__scale-point');

      resultArrayScalePoint.forEach((scalePoint) => {
        const currentValueAsPercentage = ((scalePoint.textContent - this.minValue) / (this.maxValue - this.minValue)) * 100;
        const widthScalePointAsPercentage = ((scalePoint.offsetWidth / 2) / this.widthSlider) * 100;

        scalePoint.style.left = (currentValueAsPercentage - widthScalePointAsPercentage) + '%';
      });

      this.elemSlider.style.marginBottom = '45px';
    }
  }

  setValueInMarker(valuesArray) {
    this.elemSlider.style.marginTop = '';

    if (this.showMarkers) {
      this.elemSlider.style.marginTop = '45px';

      valuesArray.forEach((currentValue, index) => {
        this.elemMarkers[index].textContent = Math.round(currentValue);
        this.elemMarkers[index].style.display = 'block';
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
      this.elemThumbs[index].dataset.value = Math.round(currentValue);
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

  setEventTargetValue(targetValue) {
    const [leftValue, rightValue] = this.elemThumbs;
    const currentLeftValue = leftValue.dataset.value;
    const currentRightValue = rightValue.dataset.value;

    const leftThumbDiff = Math.abs(targetValue - currentLeftValue);
    const rightThumbDiff = Math.abs(targetValue - currentRightValue);
    const clickInRange = this.isRange ? targetValue > currentLeftValue && targetValue < currentRightValue : false;

    if (targetValue <= currentLeftValue) this.initValuesArray[0] = targetValue;

    if (clickInRange && leftThumbDiff < rightThumbDiff) {
      this.initValuesArray[0] = targetValue;
    } else if (clickInRange && leftThumbDiff > rightThumbDiff) {
      this.initValuesArray[1] = targetValue;
    } else if (clickInRange && leftThumbDiff === rightThumbDiff) {
      this.initValuesArray[1] = targetValue;
    }

    if (targetValue >= currentRightValue || !this.isRange) this.initValuesArray[1] = targetValue;

    this.setValueForThumbs(this.initValuesArray);
  }

  setValueWhenClickingOnTheScale(event) {
    event.preventDefault();
    const targetValue = Number(event.target.textContent);

    this.setEventTargetValue(targetValue);
  }

  setPositionForThumbs(event) {
    event.preventDefault();
    if (event.target.classList.contains('meta-slider')) {
      const value = event.offsetX / this.widthSlider;
      const resultValue = ((this.maxValue - this.minValue) * value) + this.minValue;
      this.setEventTargetValue(resultValue);
    }
  }

  handleInitMouseMove(event) {
    event.preventDefault();
    const sliderPositionLeft = this.elemSlider.getBoundingClientRect().left;
    const newValuePosition = event.clientX - sliderPositionLeft;
    const value = newValuePosition / this.widthSlider;
    let resultValue = ((this.maxValue - this.minValue) * value) + this.minValue;

    if (resultValue < this.minValue) {
      resultValue = this.minValue;
    } else if (resultValue > this.maxValue) {
      resultValue = this.maxValue;
    }

    this.setEventTargetValue(resultValue);
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

  setEventsSlider() {
    const elemScalePoints = document.querySelectorAll('.meta-slider__scale-point');

    if (elemScalePoints) {
      elemScalePoints.forEach(elemPoint => {
        elemPoint.addEventListener('click', this.setValueWhenClickingOnTheScale.bind(this));
      });
    }

    this.elemSlider.addEventListener('mousedown', this.setPositionForThumbs.bind(this));
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
