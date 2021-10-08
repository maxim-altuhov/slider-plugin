import $ from 'jquery';

class ViewThumbs {
  init(options) {
    this.$selector = options.$initSelector;
    this.$elemThumbs = this.$selector.find('.js-meta-slider__thumb');
    this.setEventsThumbs(options);
  }

  setValueInThumbs(options) {
    const {
      initValuesArray,
      valuesAsPercentageArray,
      numberOfDecimalPlaces,
      customValues,
    } = options;

    initValuesArray.forEach((currentValue, index) => {
      this.$elemThumbs.eq(index).css('left', `${valuesAsPercentageArray[index]}%`).attr('data-value', currentValue.toFixed(numberOfDecimalPlaces));

      if (customValues.length > 0) {
        this.$elemThumbs.eq(index).attr('data-text', customValues[currentValue]);
      }
    });
  }

  handleChangeThumbPosition(options, event) {
    const configEventCode = (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'ArrowUp' || event.code === 'ArrowDown');
    const $target = $(event.target);
    if (configEventCode) {
      const step = options.step;
      let eventTargetValue = Number($target.attr('data-value'));

      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') event.preventDefault();
      if (event.code === 'ArrowLeft' || event.code === 'ArrowDown') eventTargetValue -= step;
      if (event.code === 'ArrowRight' || event.code === 'ArrowUp') eventTargetValue += step;

      const calculateTargetValue = this.presenter.calcTargetValue(null, eventTargetValue);

      this.presenter.checkTargetValue(calculateTargetValue, event);
    }
  }

  handleInitPointerMove(event) {
    const calculateTargetValue = this.presenter.calcTargetValue(event);

    this.presenter.checkTargetValue(calculateTargetValue, event);
  }

  static handleInitPointerUp(event) {
    const $target = $(event.target);
    $target.off('pointermove.thumb');
    $target.off('pointerup.thumb');
  }

  handleSetEventListenerForThumbs(event) {
    const $target = $(event.target);
    event.target.setPointerCapture(event.pointerId);
    $target.on('pointermove.thumb', this.handleInitPointerMove.bind(this));
    $target.on('pointerup.thumb', ViewThumbs.handleInitPointerUp.bind(this));
  }

  setEventsThumbs(options) {
    this.$elemThumbs.each((index, thumb) => {
      const $currentThumb = $(thumb);
      $currentThumb.on('pointerdown.thumb', this.handleSetEventListenerForThumbs.bind(this));
      $currentThumb.on('keydown.thumb', this.handleChangeThumbPosition.bind(this, options));
      $currentThumb.on('dragstart.thumb', false);
    });
  }
}

export default ViewThumbs;
