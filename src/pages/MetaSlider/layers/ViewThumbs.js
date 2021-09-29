import $ from 'jquery';

class ViewThumbs {
  constructor() {
    this.presenter = null;
  }

  registerWith(presenter) {
    this.presenter = presenter;
  }

  init() {
    console.log('Init Thumbs');
    this.opt = this.presenter.getOptionsObj();
    this.$selector = this.opt.$initSelector;
    this.getInfoAboutThumbs();
  }

  getInfoAboutThumbs() {
    this.$elemThumbs = this.$selector.find('.js-meta-slider__thumb');
    this.heightThumb = this.$elemThumbs.eq(-1).outerHeight();

    this.presenter.setProp('$elemThumbs', this.$elemThumbs);
    this.presenter.setProp('heightThumb', this.heightThumb);
  }

  setValueInThumbs(valuesArray, valuesAsPercentageArray) {
    valuesArray.forEach((currentValue, index) => {
      this.$elemThumbs.eq(index).css('left', `${valuesAsPercentageArray[index]}%`).attr('data-value', currentValue.toFixed(this.numberOfDecimalPlaces));

      if (this.customValues.length > 0) {
        this.$elemThumbs.eq(index).attr('data-text', this.customValues[currentValue]);
      }
    });
  }

  handleChangeThumbPosition(event) {
    const configEventCode = (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'ArrowUp' || event.code === 'ArrowDown');
    const $target = $(event.target);
    if (configEventCode) {
      let eventTargetValue = Number($target.attr('data-value'));
      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') event.preventDefault();
      if (event.code === 'ArrowLeft' || event.code === 'ArrowDown') eventTargetValue -= this.step;
      if (event.code === 'ArrowRight' || event.code === 'ArrowUp') eventTargetValue += this.step;

      const calculateTargetValue = this.calcTargetValue(null, eventTargetValue);

      this.checkTargetValue(
        calculateTargetValue,
        event,
      );
    }
  }

  handleInitPointerMove(event) {
    const calculateTargetValue = this.calcTargetValue(event);

    this.checkTargetValue(
      calculateTargetValue,
      event,
    );
  }

  handleInitPointerUp(event) {
    const $target = $(event.target);
    $target.off('pointermove.thumb');
    $target.off('pointerup.thumb');
  }

  handleSetEventListenerForThumbs(event) {
    const $target = $(event.target);
    event.target.setPointerCapture(event.pointerId);
    $target.on('pointermove.thumb', this.handleInitPointerMove.bind(this));
    $target.on('pointerup.thumb', this.handleInitPointerUp.bind(this));
  }

  setEventsThumbs() {
    this.$elemThumbs.each((index, thumb) => {
      const $currentThumb = $(thumb);
      $currentThumb.on('pointerdown.thumb', this.handleSetEventListenerForThumbs.bind(this));
      $currentThumb.on('keydown.thumb', this.handleChangeThumbPosition.bind(this));
      $currentThumb.on('dragstart.thumb', false);
    });
  }
}

export default ViewThumbs;
