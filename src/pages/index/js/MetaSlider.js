/* eslint-disable fsd/no-function-declaration-in-event-listener */
class MetaSlider {
  selector = document.querySelector('#slider');

  initValueLeft = 0;
  initValueRight = 0;

  minValue = -100;
  maxValue = 100;
  numberOfDivisions = 5;

  showError = true;
  showMinAndMaxValue = false;
  showTheScale = true;
  showMarkers = true;
  showBackgroundForRange = true;
  isRange = false;

  constructor() {
    this.renderSlider();
    this.getInfoAboutSlider();
    this.initValueCheck();
    this.init();
  }

  init() {
    this.setValueForThumbs(this.initValueRight);
    this.indicateMinAndMaxValue();
    this.createScaleOfValues();
    this.setEventsSlider();
    this.setEventsThumbs();
  }

  checkCorrectNumberOfDivisions() {
    return Number.isInteger((this.maxValue - this.minValue) / this.numberOfDivisions);
  }

  renderErrorMessage(message) {
    const elemErrorInfo = document.createElement('p');
    elemErrorInfo.classList.add('error-info');
    this.selector.append(elemErrorInfo);
    elemErrorInfo.textContent = message;
  }

  initValueCheck() {
    if (this.showError) {
      const errorMessage = {
        initValueLeft: 'Ошибка в данных для левого ползунка слайдера. Значение бегунка установлено в значение по-умолчанию',
        initValueRight: 'Ошибка в данных для правого ползунка слайдера. Значение бегунка установлено в значение по-умолчанию',
        minAndMaxValue: 'Ошибка во входящих данных: Max значение установленное для слайдера меньше его Min значения!',
        maxValue: 'Ошибка в данных для ползунка слайдера. Установленно Max возможное значение для слайдера.',
        minValue: 'Ошибка в данных для ползунка слайдера. Установленно Min возможное значение для слайдера.',
        numberOfDivisions: `Установите корректное значение кол-ва интервалов для отображения шкалы с делениями. Установлено ближайщее оптимальное значение равное ${this.numberOfDivisions}.`,
      };

      if (this.initValueLeft > this.initValueRight) {
        this.initValueLeft = this.minValue;
        this.renderErrorMessage(errorMessage.initValueLeft);
      }

      if (this.initValueRight < this.initValueLeft) {
        this.initValueRight = this.maxValue;
        this.renderErrorMessage(errorMessage.initValueRight);
      }

      if (this.minValue > this.maxValue) {
        this.renderErrorMessage(errorMessage.minAndMaxValue);
      }

      if (this.initValueRight > this.maxValue) {
        this.initValueRight = this.maxValue;
        this.renderErrorMessage(errorMessage.maxValue);
      } else if (this.initValueRight < this.minValue) {
        this.initValueRight = this.minValue;
        this.renderErrorMessage(errorMessage.minValue);
      }

      while (!this.checkCorrectNumberOfDivisions() || this.numberOfDivisions <= 0) {
        this.numberOfDivisions += 1;
        this.renderErrorMessage(errorMessage.numberOfDivisions);
      }
    }
  }

  renderSlider() {
    const fragmentWithASlider = document.createDocumentFragment();
    const blockSlider = document.createElement('div');
    blockSlider.classList.add('meta-slider');
    blockSlider.dataset.min = this.minValue;
    blockSlider.dataset.max = this.maxValue;

    const HTMLBlockWithOneThumb = `<button class="meta-slider__thumb meta-slider__thumb_right" data-value=''>
    <span class="meta-slider__marker meta-slider__marker_right" style="display:none"></span>
    </button>`;

    const HTMLBlockWithTwoThumb = `<button class="meta-slider__thumb meta-slider__thumb_left" data-value=''>
    <span class="meta-slider__marker meta-slider__marker_left" style="display:none"></span>
    </button>
    ${HTMLBlockWithOneThumb}`;

    const checkIsRangeResult = this.isRange ? HTMLBlockWithTwoThumb : HTMLBlockWithOneThumb;

    const HTMLBlockResult = `<span class="meta-slider__value meta-slider__value_min"></span>
    ${checkIsRangeResult}
    <span class="meta-slider__value meta-slider__value_max"></span>`;

    blockSlider.innerHTML = HTMLBlockResult;

    fragmentWithASlider.append(blockSlider);
    this.selector.append(fragmentWithASlider);
  }

  getInfoAboutSlider() {
    this.elemSlider = this.selector.querySelector('.meta-slider');

    this.elemThumbs = this.elemSlider.querySelectorAll('.meta-slider__thumb');
    this.elemThumbLeft = this.elemSlider.querySelector('.meta-slider__thumb_left');
    this.elemThumbRight = this.elemSlider.querySelector('.meta-slider__thumb_right');

    this.elemMarkerLeft = this.elemSlider.querySelector('.meta-slider__marker_left');
    this.elemMarkerRight = this.elemSlider.querySelector('.meta-slider__marker_right');

    this.elemWithMinValue = this.elemSlider.querySelector('.meta-slider__value_min');
    this.elemWithMaxValue = this.elemSlider.querySelector('.meta-slider__value_max');

    this.linkInitMouseMove = this.handleInitMouseMove.bind(this);
    this.linkInitMouseUp = this.handleInitMouseUp.bind(this);

    this.widthSlider = this.elemSlider.offsetWidth;
    this.widthThumb = this.elemThumbRight.offsetWidth;
    this.thumbWidthAsPercentage = ((this.widthThumb / 2) / this.widthSlider) * 100;
  }

  indicateMinAndMaxValue() {
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
      const fragmentWithAScale = document.createDocumentFragment();
      const blockScale = document.createElement('div');
      const stepValue = (this.maxValue - this.minValue) / this.numberOfDivisions;
      let currentValue;

      blockScale.classList.add('meta-slider__scale');

      for (let i = 0; i < (this.numberOfDivisions + 1); i++) {
        if (i === 0) {
          currentValue = this.minValue;
        } else if (i === (this.numberOfDivisions + 1)) {
          currentValue = this.maxValue;
        } else {
          currentValue += stepValue;
        }

        const elemScalePoint = document.createElement('button');
        elemScalePoint.classList.add('meta-slider__scale-point');
        elemScalePoint.textContent = currentValue;

        blockScale.append(elemScalePoint);
      }
      fragmentWithAScale.append(blockScale);
      this.elemSlider.appendChild(fragmentWithAScale);

      const resultArrayScalePoint = document.querySelectorAll('.meta-slider__scale-point');

      resultArrayScalePoint.forEach((scalePoint) => {
        // eslint-disable-next-line max-len
        const currentValueAsPercentage = ((scalePoint.textContent - this.minValue) / (this.maxValue - this.minValue)) * 100;
        const widthScalePointAsPercentage = ((scalePoint.offsetWidth / 2) / this.widthSlider) * 100;

        scalePoint.style.left = (currentValueAsPercentage - widthScalePointAsPercentage) + '%';
      });

      this.elemSlider.style.marginBottom = '45px';
    }
  }

  setValueInMarker(value) {
    this.elemMarkerRight.style.display = 'none';

    if (this.showMarkers) {
      this.elemSlider.style.marginTop = '45px';
      this.elemMarkerRight.textContent = Math.round(value);
      this.elemMarkerRight.style.display = 'block';
    }
  }

  setBackgroundTheRange(value) {
    if (this.showBackgroundForRange) {
      const color = `linear-gradient(90deg, #6d6dff ${value}%, #e4e4e4 ${value}%)`;
      this.elemSlider.style.background = color;
    }
  }

  setValueForSlider(value, valueAsPercentage) {
    this.elemThumbs[0].dataset.value = Math.round(value);
    this.elemThumbs[0].style.left = (valueAsPercentage - this.thumbWidthAsPercentage) + '%';
    this.setBackgroundTheRange(valueAsPercentage);
    this.setValueInMarker(value);
  }

  setValueForThumbs(value) {
    const valueAsPercentage = ((value - this.minValue) / (this.maxValue - this.minValue)) * 100;

    this.setValueForSlider(value, valueAsPercentage);
  }

  setValueFromScale(event) {
    const value = event.target.textContent;
    this.setValueForThumbs(value);
  }

  setPositionForThumbs(event) {
    if (event.target.classList.contains('meta-slider')) {
      const value = event.offsetX / this.widthSlider;
      const valueAsPercentage = value * 100;

      const resultValue = ((this.maxValue - this.minValue) * value) + this.minValue;
      this.setValueForSlider(resultValue, valueAsPercentage);
    }
  }

  handleInitMouseMove(event) {
    const sliderPositionLeft = this.elemSlider.getBoundingClientRect().left;
    const newValuePosition = event.clientX - sliderPositionLeft;
    let value = newValuePosition / this.widthSlider;
    let valueAsPercentage = value * 100;
    let resultValue = ((this.maxValue - this.minValue) * value) + this.minValue;

    if (valueAsPercentage < 0) {
      valueAsPercentage = 0;
      resultValue = this.minValue;
    } else if (valueAsPercentage > 100) {
      valueAsPercentage = 100;
      resultValue = this.maxValue;
    }

    this.setValueForSlider(resultValue, valueAsPercentage);
  }

  handleInitMouseUp() {
    document.removeEventListener('mousemove', this.linkInitMouseMove);
    document.removeEventListener('mouseup', this.linkInitMouseUp);
  }

  setEventsSlider() {
    const elemScalePoints = document.querySelectorAll('.meta-slider__scale-point');

    if (elemScalePoints) {
      elemScalePoints.forEach(elemPoint => {
        elemPoint.addEventListener('click', this.setValueFromScale.bind(this));
      });
    }

    this.elemSlider.addEventListener('mousedown', this.setPositionForThumbs.bind(this));
  }

  setEventsThumbs() {
    this.elemThumbs.forEach(thumb => {
      thumb.addEventListener('mousedown', (event) => {
        event.preventDefault();

        document.addEventListener('mousemove', this.linkInitMouseMove);
        document.addEventListener('mouseup', this.linkInitMouseUp);
      });

      thumb.addEventListener('dragstart', () => false);
    });
  }
}

export default MetaSlider;
