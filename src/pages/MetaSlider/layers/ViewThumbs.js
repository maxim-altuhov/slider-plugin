import $ from 'jquery';
import Observer from '../patterns/Observer';

class ViewThumbs extends Observer {
  constructor() {
    super();
    this.isFirstInit = true;
  }

  init(options) {
    this.$selector = options.$selector;
    this.$elemThumbs = options.$elemThumbs;
    this.setEventsThumbs(options);
  }

  update(options) {
    if (this.isFirstInit) {
      this.init(options);
      this.isFirstInit = false;
    }

    const { key } = options;
    const setValueVerifKeys = (
      key === 'init'
      || key === 'changedValue'
      || key === 'initValueFirst'
      || key === 'initValueSecond'
      || key === 'customValues'
      || key === 'numberOfDecimalPlaces'
      || key === 'isRange'
      || key === 'minValue'
      || key === 'maxValue'
    );
    const styleVerifKeys = (
      key === 'init'
      || key === 'mainColor'
      || key === 'colorThumb'
      || key === 'colorBorderForThumb'
    );

    if (setValueVerifKeys) this.setValueInThumbs(options);
    if (styleVerifKeys) this.setStyleForThumbs(options);
    if (key === 'isRange' || key === 'init') this.checkIsRange(options);
  }

  setStyleForThumbs(options) {
    const {
      mainColor,
      colorThumb,
      colorBorderForThumb,
    } = options;

    const backgroundColor = colorThumb || mainColor;

    this.$elemThumbs.each((index, thumb) => {
      $(thumb).css({ 'background-color': backgroundColor, 'border-color': colorBorderForThumb });
    });
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
      } else {
        this.$elemThumbs.eq(index).removeAttr('data-text');
      }
    });
  }

  checkIsRange(options) {
    if (options.isRange) {
      this.$elemThumbs.eq(0).css('display', '');
    } else {
      this.$elemThumbs.eq(0).css('display', 'none');
    }
  }

  handleChangeThumbPosition(options, event) {
    const configEventCode = (
      event.code === 'ArrowLeft'
      || event.code === 'ArrowRight'
      || event.code === 'ArrowUp'
      || event.code === 'ArrowDown'
    );
    const $target = $(event.target);

    if (configEventCode) {
      const { step } = options;
      let eventTargetValue = Number($target.attr('data-value'));

      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') event.preventDefault();
      if (event.code === 'ArrowLeft' || event.code === 'ArrowDown') eventTargetValue -= step;
      if (event.code === 'ArrowRight' || event.code === 'ArrowUp') eventTargetValue += step;

      this.notify(event, eventTargetValue);
    }
  }

  handleInitPointerMove(event) {
    this.notify(event);
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
