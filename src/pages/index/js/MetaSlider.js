/* eslint-disable fsd/no-function-declaration-in-event-listener */
class MetaSlider {
  initValueLeft = 0;
  initValueRight = 50;

  minValue = 0;
  maxValue = 100;
  numberOfDivisions = 5;

  showMinAndMaxValue = false;
  showTheScale = true;
  showMarkers = true;
  isRange = false;

  selector = document.querySelector('#slider');

  elemSlider;
  elemThumbs;
  elemThumbLeft;
  elemThumbRight;
  elemMarkerLeft;
  elemMarkerRight;
  elemWithMinValue;
  elemWithMaxValue;
  linkInitMouseMove;
  linkInitMouseUp;
  widthSlider;
  widthThumb;

  constructor() {
    this.renderSlider();
    this.getInfoAboutSlider();
    this.init();
  }

  init() {
    this.setEventsSlider();
    this.setEventsThumbs();
    this.setValueForThumbs(this.initValueRight);
    this.indicateMinAndMaxValue();
    this.createScaleOfValues();
  }

  renderSlider() {
    const fragmentWithASlider = document.createDocumentFragment();
    const blockSlider = document.createElement('div');
    blockSlider.classList.add('meta-slider');
    blockSlider.dataset.min = this.minValue;
    blockSlider.dataset.max = this.maxValue;

    const HTMLBlockWithOneThumb = `<span class="meta-slider__value meta-slider__value_min"></span>
    <button class="meta-slider__thumb meta-slider__thumb_right" data-value=''>
      <span class="meta-slider__marker meta-slider__marker_right"></span>
    </button>
    <span class="meta-slider__value meta-slider__value_max"></span>`;

    blockSlider.innerHTML = HTMLBlockWithOneThumb;

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
  }

  indicateMinAndMaxValue() {
    this.elemSlider.dataset.min = this.minValue;
    this.elemSlider.dataset.max = this.maxValue;

    if (this.showMinAndMaxValue && !this.showTheScale) {
      this.elemWithMinValue.textContent = this.minValue;
      this.elemWithMaxValue.textContent = this.maxValue;
      this.elemSlider.style.marginBottom = '45px';
    }
  }

  createScaleOfValues() {
    if (this.showTheScale && !this.showMinAndMaxValue) {
      const fragmentWithAScale = document.createDocumentFragment();
      const blockScale = document.createElement('ul');
      const stepValue = Math.round(this.maxValue / this.numberOfDivisions);
      let currentValue = this.minValue;

      blockScale.classList.add('meta-slider__scale');

      for (let i = 0; i < this.numberOfDivisions + 1; i++) {
        if (i === 0) {
          currentValue = this.minValue;
        } else if (i === (this.numberOfDivisions + 1)) {
          currentValue = this.maxValue;
        } else {
          currentValue += stepValue;
        }

        const elemScalePoint = document.createElement('li');
        elemScalePoint.classList.add('meta-slider__scale-point');
        elemScalePoint.textContent = currentValue;

        blockScale.append(elemScalePoint);
      }
      fragmentWithAScale.append(blockScale);
      this.elemSlider.appendChild(fragmentWithAScale);

      const resultArrayScalePoint = document.querySelectorAll('.meta-slider__scale-point');

      resultArrayScalePoint.forEach(scalePoint => {
        let currentValueAsPercentage = (scalePoint.textContent / this.maxValue) * 100;
        let widthScalePointAsPercentage = ((scalePoint.offsetWidth / 2) * 100) / this.widthSlider;

        scalePoint.style.left = (currentValueAsPercentage - widthScalePointAsPercentage) + '%';
      });

      this.elemSlider.style.marginBottom = '45px';
    }
  }

  setValueInMarker(value) {
    if (this.showMarkers) {
      this.elemSlider.style.marginTop = '45px';
      this.elemMarkerRight.textContent = Math.round(value);
    } else {
      this.elemMarkerRight.style.display = 'none';
    }
  }

  setBackgroundTheRange(value) {
    let color = `linear-gradient(90deg, #6d6dff ${value}%, #e4e4e4 ${value}%)`;
    this.elemSlider.style.background = color;
  }

  setValueForThumbs(value) {
    let thumbWidthAsPercentage = ((this.widthThumb / 2) * 100) / this.widthSlider;
    let valueAsPercentage = (value / this.maxValue) * 100;

    this.elemThumbs[0].dataset.value = Math.round(value);
    this.elemThumbs[0].style.left = (valueAsPercentage - thumbWidthAsPercentage) + '%';
    this.setBackgroundTheRange(valueAsPercentage);
    this.setValueInMarker(value);
  }

  setPositionForThumbs(event) {
    if (event.target.classList.contains('meta-slider')) {
      let valueAsPercentage = ((event.offsetX / this.widthSlider) * 100);
      let value = ((this.maxValue * valueAsPercentage) / 100);

      this.setValueForThumbs(value);
    }
  }

  handleInitMouseMove(event) {
    let sliderPositionLeft = this.elemSlider.getBoundingClientRect().left;
    let newValuePosition = event.clientX - sliderPositionLeft;

    let valueAsPercentage = (newValuePosition * 100) / this.widthSlider;
    let value = (this.maxValue * valueAsPercentage) / 100;

    if (value < 0) {
      value = 0;
    } else if (value > this.maxValue) {
      value = this.maxValue;
    }

    this.setValueForThumbs(value);
  }

  handleInitMouseUp() {
    document.removeEventListener('mousemove', this.linkInitMouseMove);
    document.removeEventListener('mouseup', this.linkInitMouseUp);
  }

  setEventsSlider() {
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
