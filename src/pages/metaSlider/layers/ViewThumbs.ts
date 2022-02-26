import makeThrottlingHandler from '../utils/makeThrottlingHandler';
import Observer from '../patterns/Observer';

class ViewThumbs extends Observer {
  private _$elemThumbs = $();
  private _isFirstInit = true;
  private _verifKeysObj = {
    setValueKeys: [
      'init',
      'changedValue',
      'initValueFirst',
      'initValueSecond',
      'customValues',
      'calcNumberOfDecimalPlaces',
      'numberOfDecimalPlaces',
      'isRange',
      'minValue',
      'maxValue',
      'step',
    ],
    setStyleKeys: ['init', 'mainColor', 'colorThumb', 'colorBorderForThumb'],
    checkIsRangeKeys: ['init', 'isRange'],
  };

  update(options: IPluginOptions) {
    if (this._isFirstInit) {
      this._init(options);
      this._isFirstInit = false;
    }

    const { key } = options;
    const { setValueKeys, setStyleKeys, checkIsRangeKeys } = this._verifKeysObj;

    if (setValueKeys.includes(key)) this._setValueInThumbs(options);
    if (setStyleKeys.includes(key)) this._setStyleForThumbs(options);
    if (checkIsRangeKeys.includes(key)) this._checkIsRange(options);
  }

  private _init(options: IPluginOptions) {
    this._$elemThumbs = options.$elemThumbs;
    this._setEventsThumbs(options);
  }

  private _setStyleForThumbs(options: IPluginOptions) {
    const { mainColor, colorThumb, colorBorderForThumb } = options;
    const backgroundColor = colorThumb || mainColor;

    this._$elemThumbs.css({
      'background-color': backgroundColor,
      'border-color': colorBorderForThumb,
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
    this._$elemThumbs.on('pointerdown.thumb', this._handleThumbPointerdown.bind(this));
    this._$elemThumbs.on('keydown.thumb', this._handleThumbKeydown.bind(this, options));
  }

  // Changing the position of the thumbs sliders when using the keyboard
  private _handleThumbKeydown(
    options: IPluginOptions,
    event: Event & { target: EventTarget; code?: string },
  ) {
    const { code, target } = event;
    const listEventCode = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const $target = $(target);

    if (code && listEventCode.includes(code)) {
      event.preventDefault();
      const [codeLeft, codeRight, codeUp, codeDown] = listEventCode;
      const { step } = options;
      let targetValue = Number($target.attr('data-value'));

      if (code === codeLeft || code === codeDown) targetValue -= step;
      if (code === codeRight || code === codeUp) targetValue += step;

      this.notify(event, targetValue);
    }
  }

  // Installing event handlers for movement/termination of thumbs sliders
  private _handleThumbPointerdown(event: Event & { target: Element; pointerId?: number }) {
    const { target, pointerId } = event;

    if (typeof pointerId !== 'undefined') target.setPointerCapture(pointerId);

    const $target = $(target);
    $target.on(
      'pointermove.thumb',
      makeThrottlingHandler(this._handleThumbPointermove.bind(this), 50),
    );
    $target.on('pointerup.thumb', ViewThumbs._handleThumbPointerup.bind(this));
  }

  // Tracking the movement of thumbs sliders
  private _handleThumbPointermove(event: Event) {
    this.notify(event);
  }

  // Tracking the termination of the thumbs sliders
  private static _handleThumbPointerup(event: Event & { target: EventTarget }) {
    const $target = $(event.target);
    $target.off('pointermove.thumb');
    $target.off('pointerup.thumb');
  }
}

export default ViewThumbs;
