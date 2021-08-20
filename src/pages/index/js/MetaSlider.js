/* eslint-disable fsd/no-function-declaration-in-event-listener */
class MetaSlider {
  elemSlider = document.querySelector('.meta-slider');
  elemThumbs = this.elemSlider.querySelectorAll('.meta-slider__thumb');
  linkInitMouseMove = this.handleInitMouseMove.bind(this);
  lenkInitMouseUp = this.handleInitMouseUp.bind(this);
  widthSlider = this.elemSlider.offsetWidth;

  constructor() {
    this.init();
  }

  init() {
    this.setEventsSlider();
    this.setEventsThumbs();
  }

  getResultValue(event) {
    let resultValue = (event.offsetX / this.widthSlider) * 100;

    return resultValue;
  }

  setBackgroundTheRange(resultValue) {
    let color = `linear-gradient(90deg, #6d6dff ${resultValue}%, #e4e4e4 ${resultValue}%)`;
    this.elemSlider.style.background = color;
  }

  setPositionForThumbs(event) {
    if (event.target.classList.contains('meta-slider')) {
      this.elemThumbs[0].style.left = this.getResultValue(event) + '%';
      this.setBackgroundTheRange(this.getResultValue(event));
    }
  }

  handleInitMouseMove(event) {
    let newValueLeft = event.clientX - this.elemSlider.getBoundingClientRect().left;
    let resultAsPercentage = (newValueLeft * 100) / this.widthSlider;

    if (resultAsPercentage < 0) {
      resultAsPercentage = 0;
    }
    if (resultAsPercentage > 100) {
      resultAsPercentage = 100;
    }
    this.elemThumbs[0].style.left = resultAsPercentage + '%';
    this.setBackgroundTheRange(resultAsPercentage);
  }

  handleInitMouseUp() {
    document.removeEventListener('mousemove', this.linkInitMouseMove);
    document.removeEventListener('mouseup', this.lenkInitMouseUp);
  }

  setEventsSlider() {
    this.elemSlider.addEventListener('click', this.setPositionForThumbs.bind(this));
  }

  setEventsThumbs() {
    this.elemThumbs.forEach(thumb => {
      thumb.addEventListener('mousedown', (event) => {
        event.preventDefault();
        document.addEventListener('mousemove', this.linkInitMouseMove);
        document.addEventListener('mouseup', this.lenkInitMouseUp);
      });

      thumb.addEventListener('dragstart', () => false);
    });
  }
}

export default MetaSlider;
