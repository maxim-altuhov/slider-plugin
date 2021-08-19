/* eslint-disable fsd/no-function-declaration-in-event-listener */
class MetaSlider {
  sliderElem = document.querySelector('.meta-slider');
  thumb = this.sliderElem.querySelectorAll('.meta-slider__thumb');
  width = this.sliderElem.getBoundingClientRect().width;
  shiftX;

  init() {
    this.initSlider();
    this.test();
  }

  initSlider() {
    this.sliderElem.addEventListener('click', (event) => {
      if (event.target.classList.contains('meta-slider')) {
        const resultValue = (event.offsetX / this.width) * 100;
        this.thumb[0].style.left = resultValue + '%';
        this.setTheRange(resultValue);
      }
    });
  }

  setTheRange(resultValue) {
    const color = `linear-gradient(90deg, #6d6dff ${resultValue}%, #e4e4e4 ${resultValue}%)`;
    this.sliderElem.style.background = color;
  }

  test() {
    this.thumb.forEach(elem => {
      elem.addEventListener('mousedown', (event) => {
        event.preventDefault();
      });
    });
  }
}

export default MetaSlider;
