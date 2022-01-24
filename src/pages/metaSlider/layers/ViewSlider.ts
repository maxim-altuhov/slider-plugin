import createUniqueID from '../utils/createUniqueID';

class ViewSlider {
  private _$selector = $();
  private _$elemSlider = $();
  private _$sliderProgress = $();
  private _$elemThumbs = $();
  private _$elemMarkers = $();
  private _isFirstInit = true;
  private _verifKeysObj = {
    setBackgroundRangeKeys: [
      'init',
      'showBackground',
      'mainColor',
      'changedValue',
      'initValueFirst',
      'initValueSecond',
      'isRange',
      'minValue',
      'maxValue',
      'customValues',
      'step',
      'calcNumberOfDecimalPlaces',
      'numberOfDecimalPlaces',
    ],
    setBackgroundSliderKeys: ['init', 'secondColor'],
    setVerticalKeys: ['init', 'isVertical'],
    setAutoMarginsKeys: ['init', 'initAutoMargins', 'showMarkers', 'showScale', 'isVertical'],
    setMinAndMaxKeys: ['init', 'minValue', 'maxValue', 'customValues'],
  };

  constructor(private _view: TypeMainView) {}

  update(options: IPluginOptions) {
    if (this._isFirstInit) {
      this._init(options);
      this._isFirstInit = false;
    }

    const { key } = options;
    const {
      setBackgroundRangeKeys,
      setBackgroundSliderKeys,
      setVerticalKeys,
      setAutoMarginsKeys,
      setMinAndMaxKeys,
    } = this._verifKeysObj;

    if (setBackgroundRangeKeys.includes(key)) this._setBackgroundTheRange(options);
    if (setBackgroundSliderKeys.includes(key)) this._setBackgroundForSlider(options);
    if (setVerticalKeys.includes(key)) this._setVerticalOrientation(options);
    if (setAutoMarginsKeys.includes(key)) this._setAutoMargins(options);
    if (setMinAndMaxKeys.includes(key)) this._setMinAndMaxVal(options);
  }

  renderSlider($initSelector: JQuery<HTMLElement>) {
    const sliderID = createUniqueID();

    if (this._$selector.length === 0) {
      this._$selector = $initSelector;
      const $fragmentWithASlider = $(document.createDocumentFragment());
      const $blockSlider = $(document.createElement('div'));

      $blockSlider.addClass('meta-slider js-meta-slider');
      this._$selector.attr('data-id', sliderID);

      const HTMLBlock = `<div class="meta-slider__progress js-meta-slider__progress"></div>
    <button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_left" data-value="" data-text="">
      <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_left"></span>
    </button>
    <button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_right" data-value="" data-text="">
      <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_right"></span>
    </button>
    <div class="meta-slider__scale js-meta-slider__scale"></div>`;

      $blockSlider.html(HTMLBlock);

      $fragmentWithASlider.append($blockSlider);
      this._$selector.append($fragmentWithASlider);
    }
  }

  private _init(options: IPluginOptions) {
    // prettier-ignore
    const { 
      $elemSlider,
      $sliderProgress,
      $elemThumbs,
      $elemMarkers,
    } = options;

    this._$elemSlider = $elemSlider;
    this._$sliderProgress = $sliderProgress;
    this._$elemThumbs = $elemThumbs;
    this._$elemMarkers = $elemMarkers;
    this._setEventsSlider();
  }

  // Sets data attributes with min. and max. slider values
  private _setMinAndMaxVal(options: IPluginOptions) {
    const { minValue, maxValue, customValues } = options;

    this._$elemSlider.attr({ 'data-min': minValue, 'data-max': maxValue });

    if (customValues.length > 0) {
      const firstCustomElem = customValues[0];
      const lastCustomElem = customValues[customValues.length - 1];
      this._$elemSlider.attr({ 'data-min_text': firstCustomElem, 'data-max_text': lastCustomElem });
    } else {
      this._$elemSlider.removeAttr('data-min_text data-max_text');
    }
  }

  // Checking and setting slider margins
  private _setAutoMargins(options: IPluginOptions) {
    // prettier-ignore
    const { 
      initAutoMargins,
      showMarkers,
      showScale,
      isVertical,
    } = options;

    const verifProp = initAutoMargins && !isVertical;

    if (verifProp && showMarkers) {
      const heightMarker = this._$elemMarkers.outerHeight() || 0;
      const heightThumb = this._$elemThumbs.outerHeight() || 0;
      this._$elemSlider.css('margin-top', `${heightMarker + heightThumb / 1.5}px`);
    } else {
      this._$elemSlider.prop('style').removeProperty('margin-top');
    }

    if (verifProp && showScale) {
      const $elemScalePoints = this._$selector.find('.js-meta-slider__scale-point');
      const elemScalePointsHeight = $elemScalePoints.outerHeight() || 0;
      this._$elemSlider.css('margin-bottom', `${elemScalePointsHeight * 1.5}px`);
    } else {
      this._$elemSlider.prop('style').removeProperty('margin-bottom');
    }
  }

  private _setBackgroundForSlider(options: IPluginOptions) {
    this._$elemSlider.css('background-color', options.secondColor);
  }

  private _setVerticalOrientation(options: IPluginOptions) {
    if (options.isVertical) {
      this._$elemSlider.addClass('meta-slider_vertical');
    } else {
      this._$elemSlider.removeClass('meta-slider_vertical');
    }
  }

  // Checking and setting the fill color of the interval between the thumbs
  private _setBackgroundTheRange(options: IPluginOptions) {
    if (options.showBackground) {
      const { valuesAsPercentageArray, mainColor } = options;
      const [firstPosition, secondPosition] = valuesAsPercentageArray;

      const settingForRange = {
        left: `${firstPosition}%`,
        right: `${100 - secondPosition}%`,
        background: mainColor,
      };

      this._$sliderProgress.css(settingForRange);
    } else {
      this._$sliderProgress.css('background', 'none');
    }
  }

  // Click event handler inside the slider
  private _setEventsSlider() {
    this._$elemSlider.on('pointerdown.slider', this._handleSliderPointerdown.bind(this));
  }

  // Gets values when clicked inside the slider
  private _handleSliderPointerdown(event: Event & { target: EventTarget }) {
    event.preventDefault();
    const $target = $(event.target);

    if ($target.hasClass('js-meta-slider')) {
      this._view.updateModel(event);
    }
  }
}

export default ViewSlider;
