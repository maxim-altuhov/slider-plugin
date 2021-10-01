import $ from 'jquery';

class ViewThumbs {
  constructor() {
    this.presenter = null;
  }

  init() {
    this.$selector = this.getProp('$initSelector');
    this.getInfoAboutThumbs();
    this.setEventsThumbs();
  }

  registerWith(presenter) {
    this.presenter = presenter;
  }

  getProp(prop) {
    return this.presenter.getProp(prop);
  }

  setProp(prop, value) {
    this.presenter.setProp(prop, value);
  }

  getInfoAboutThumbs() {
    this.$elemThumbs = this.$selector.find('.js-meta-slider__thumb');
    this.heightThumb = this.$elemThumbs.eq(-1).outerHeight();

    this.presenter.setProp('$elemThumbs', this.$elemThumbs);
    this.presenter.setProp('heightThumb', this.heightThumb);
  }

  setValueInThumbs() {
    const initValuesArray = this.getProp('initValuesArray');
    const valuesAsPercentageArray = this.getProp('valuesAsPercentageArray');
    const numberOfDecimalPlaces = this.getProp('numberOfDecimalPlaces');
    const customValues = this.getProp('customValues');

    initValuesArray.forEach((currentValue, index) => {
      this.$elemThumbs.eq(index).css('left', `${valuesAsPercentageArray[index]}%`).attr('data-value', currentValue.toFixed(numberOfDecimalPlaces));

      if (customValues.length > 0) {
        this.$elemThumbs.eq(index).attr('data-text', customValues[currentValue]);
      }
    });
  }

  handleChangeThumbPosition(event) {
    const configEventCode = (event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'ArrowUp' || event.code === 'ArrowDown');
    const $target = $(event.target);
    if (configEventCode) {
      const step = this.getProp('step');
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
