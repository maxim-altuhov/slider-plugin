/* eslint-disable fsd/no-function-declaration-in-event-listener */
class MetaSlider {
  initValueLeft = 0;
  initValueRight = 50;

  minValue = 0;
  maxValue = 200;

  showMinAndMaxValue = true;
  showTheScale = false;
  showMarkers = true;

  elemSlider = document.querySelector('.meta-slider');

  elemThumbs = this.elemSlider.querySelectorAll('.meta-slider__thumb');
  elemThumbLeft = this.elemSlider.querySelector('.meta-slider__thumb_left');
  elemThumbRight = this.elemSlider.querySelector('.meta-slider__thumb_right');

  elemMarkerLeft = this.elemSlider.querySelector('.meta-slider__marker_left');
  elemMarkerRight = this.elemSlider.querySelector('.meta-slider__marker_right');

  elemWithMinValue = this.elemSlider.querySelector('.meta-slider__value_min');
  elemWithMaxValue = this.elemSlider.querySelector('.meta-slider__value_max');

  linkInitMouseMove = this.handleInitMouseMove.bind(this);
  linkInitMouseUp = this.handleInitMouseUp.bind(this);

  widthSlider = this.elemSlider.offsetWidth;

  constructor() {
    this.init();
  }

  init() {
    this.setEventsSlider();
    this.setEventsThumbs();
    this.setValueForThumbs(this.initValueRight);
    this.indicateMinAndMaxValue();
    this.createScaleOfValues();
  }

  indicateMinAndMaxValue() {
    this.elemSlider.dataset.min = this.minValue;
    this.elemSlider.dataset.max = this.maxValue;

    if (this.showMinAndMaxValue && !this.showTheScale) {
      this.elemWithMinValue.textContent = this.minValue;
      this.elemWithMaxValue.textContent = this.maxValue;
    }
  }

  createScaleOfValues() {
    if (this.showTheScale && !this.showMinAndMaxValue) {
      console.log('createScaleOfValues');
    }
  }

  setValueInMarker(value) {
    if (this.showMarkers) {
      this.elemMarkerRight.textContent = Math.round(value);
    }
  }

  setBackgroundTheRange(value) {
    let color = `linear-gradient(90deg, #6d6dff ${value}%, #e4e4e4 ${value}%)`;
    this.elemSlider.style.background = color;
  }

  setValueForThumbs(value) {
    let valueAsPercentage = (value / this.maxValue) * 100;

    this.elemThumbs[0].dataset.value = Math.round(value);
    this.elemThumbs[0].style.left = valueAsPercentage + '%';
    this.setBackgroundTheRange(valueAsPercentage);
    this.setValueInMarker(value);
  }

  setPositionForThumbs(event) {
    if (event.target.classList.contains('meta-slider')) {
      let valueAsPercentage = ((event.offsetX / this.widthSlider) * 100);
      let value = (this.maxValue * valueAsPercentage) / 100;

      this.setValueForThumbs(value);
    }
  }

  handleInitMouseMove(event) {
    let newValuePosition = event.clientX - this.elemSlider.getBoundingClientRect().left;
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
    this.elemSlider.addEventListener('click', this.setPositionForThumbs.bind(this));
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
