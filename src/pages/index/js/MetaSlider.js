/* eslint-disable fsd/no-function-declaration-in-event-listener */
class MetaSlider {
  minValue = 0;
  maxValue = 100;
  elemSlider = document.querySelector('.meta-slider');
  elemThumbs = this.elemSlider.querySelectorAll('.meta-slider__thumb');
  elemMarker = this.elemSlider.querySelector('.meta-slider__thumb > .meta-slider__marker');
  linkInitMouseMove = this.handleInitMouseMove.bind(this);
  linkInitMouseUp = this.handleInitMouseUp.bind(this);
  widthSlider = this.elemSlider.offsetWidth;
  initValueRight = 50;

  constructor() {
    this.init();
  }

  init() {
    this.setEventsSlider();
    this.setEventsThumbs();
    this.setValueForThumbs(this.initValueRight);
  }

  setValueInMarker(value) {
    if (this.elemMarker) {
      this.elemMarker.textContent = Math.round(value);
    }
  }

  setBackgroundTheRange(value) {
    let color = `linear-gradient(90deg, #6d6dff ${value}%, #e4e4e4 ${value}%)`;
    this.elemSlider.style.background = color;
  }

  setValueForThumbs(value) {
    this.elemThumbs[0].dataset.value = Math.round(value);
    this.elemThumbs[0].style.left = value + '%';
    this.setBackgroundTheRange(value);
    this.setValueInMarker(value);
  }

  setPositionForThumbs(event) {
    if (event.target.classList.contains('meta-slider')) {
      let positionValue = ((event.offsetX / this.widthSlider) * 100);

      this.elemThumbs[0].style.left = positionValue + '%';
      this.setValueForThumbs(positionValue);
    }
  }

  handleInitMouseMove(event) {
    let newValuePosition = event.clientX - this.elemSlider.getBoundingClientRect().left;
    let resultAsPercentage = (newValuePosition * 100) / this.widthSlider;

    if (resultAsPercentage < 0) {
      resultAsPercentage = 0;
    } else if (resultAsPercentage > 100) {
      resultAsPercentage = 100;
    }

    this.elemThumbs[0].style.left = resultAsPercentage + '%';
    this.setValueForThumbs(resultAsPercentage);
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
