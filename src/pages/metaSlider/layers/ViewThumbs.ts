import makeThrottlingHandler from '../utils/makeThrottlingHandler';
import Observer from '../patterns/Observer';

class ViewThumbs extends Observer {
  private _$elemThumbs = $();
  private _isFirstInit = true;

  update(options: IPluginOptions) {
    if (this._isFirstInit) {
      this._init(options);
      this._isFirstInit = false;
    }

    const { key } = options;

    const setValueVerifKeys =
      key === 'init' ||
      key === 'changedValue' ||
      key === 'initValueFirst' ||
      key === 'initValueSecond' ||
      key === 'customValues' ||
      key === 'calcNumberOfDecimalPlaces' ||
      key === 'numberOfDecimalPlaces' ||
      key === 'isRange' ||
      key === 'minValue' ||
      key === 'maxValue' ||
      key === 'step';

    const styleVerifKeys =
      key === 'init' ||
      key === 'mainColor' ||
      key === 'colorThumb' ||
      key === 'colorBorderForThumb';

    if (setValueVerifKeys) this._setValueInThumbs(options);
    if (styleVerifKeys) this._setStyleForThumbs(options);
    if (key === 'init' || key === 'isRange') this._checkIsRange(options);
  }

  private _init(options: IPluginOptions) {
    this._$elemThumbs = options.$elemThumbs;
    this._setEventsThumbs(options);
  }

  private _setStyleForThumbs(options: IPluginOptions) {
    const { mainColor, colorThumb, colorBorderForThumb } = options;
    const backgroundColor = colorThumb || mainColor;

    this._$elemThumbs.each((_, thumb) => {
      $(thumb).css({ 'background-color': backgroundColor, 'border-color': colorBorderForThumb });
    });
  }

  // Setting the sliders to the desired positions and adding data attributes for the slider
  private _setValueInThumbs(options: IPluginOptions) {
    // prettier-ignore
    const { 
      initValuesArray,
      valuesAsPercentageArray,
      numberOfDecimalPlaces,
      customValues,
    } = options;

    initValuesArray.forEach((currentValue, index) => {
      this._$elemThumbs
        .eq(index)
        .css('left', `${valuesAsPercentageArray[index]}%`)
        .attr('data-value', currentValue.toFixed(numberOfDecimalPlaces));

      if (customValues.length > 0) {
        this._$elemThumbs.eq(index).attr('data-text', customValues[currentValue]);
      } else {
        this._$elemThumbs.eq(index).removeAttr('data-text');
      }
    });
  }

  // Checking the slider's "IsRange" option and showing/hiding the first thumb
  private _checkIsRange(options: IPluginOptions) {
    if (options.isRange) {
      this._$elemThumbs.eq(0).css('display', '');
    } else {
      this._$elemThumbs.eq(0).css('display', 'none');
    }
  }

  private _setEventsThumbs(options: IPluginOptions) {
    this._$elemThumbs.each((_, thumb) => {
      const $currentThumb = $(thumb);

      $currentThumb.on('pointerdown.thumb', this._handleSetEventListenerForThumbs.bind(this));
      $currentThumb.on('keydown.thumb', this._handleChangeThumbPosition.bind(this, options));
    });
  }

  // Changing the position of the thumbs sliders when using the keyboard
  private _handleChangeThumbPosition(
    options: IPluginOptions,
    event: Event & { target: EventTarget; code?: string },
  ) {
    const { code, target } = event;

    // prettier-ignore
    const configEventCode = 
      code === 'ArrowLeft' ||
      code === 'ArrowRight' ||
      code === 'ArrowUp' ||
      code === 'ArrowDown';

    const $target = $(target);

    if (configEventCode) {
      const { step } = options;
      let eventTargetValue = Number($target.attr('data-value'));

      event.preventDefault();
      if (code === 'ArrowLeft' || code === 'ArrowDown') eventTargetValue -= step;
      if (code === 'ArrowRight' || code === 'ArrowUp') eventTargetValue += step;

      this.notify(event, eventTargetValue);
    }
  }

  // Installing event handlers for movement/termination of thumbs sliders
  private _handleSetEventListenerForThumbs(event: Event & { target: Element; pointerId?: number }) {
    const { target, pointerId } = event;

    if (target && pointerId) target.setPointerCapture(pointerId);

    const $target = $(target);
    $target.on(
      'pointermove.thumb',
      makeThrottlingHandler(this._handleInitPointerMove.bind(this), 50),
    );
    $target.on('pointerup.thumb', ViewThumbs._handleInitPointerUp.bind(this));
  }

  // Tracking the movement of thumbs sliders
  private _handleInitPointerMove(event: Event) {
    this.notify(event);
  }

  // Tracking the termination of the thumbs sliders
  private static _handleInitPointerUp(event: Event & { target: EventTarget }) {
    const $target = $(event.target);
    $target.off('pointermove.thumb');
    $target.off('pointerup.thumb');
  }
}

export default ViewThumbs;
