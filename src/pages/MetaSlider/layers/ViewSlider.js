import $ from 'jquery';
import Observer from '../patterns/Observer';

class ViewSlider extends Observer {
  constructor() {
    super();
    this.isFirstInit = true;
  }

  init(options) {
    this.$elemSlider = options.$elemSlider;
    this.$sliderProgress = options.$sliderProgress;
    this.$elemThumbs = options.$elemThumbs;
    this.$elemMarkers = options.$elemMarkers;
    this.setEventsSlider();
  }

  update(options) {
    if (this.isFirstInit) {
      this.init(options);
      this.isFirstInit = false;
    }

    const { key } = options;
    const setValueVerifKeys = (
      key === 'init'
      || key === 'showBackground'
      || key === 'mainColor'
      || key === 'changedValue'
      || key === 'initValueFirst'
      || key === 'initValueSecond'
      || key === 'isRange'
      || key === 'minValue'
      || key === 'maxValue'
      || key === 'customValues'
    );
    const autoMarginVerifKeys = (
      key === 'init'
      || key === 'initAutoMargins'
      || key === 'showMarkers'
      || key === 'showScale'
      || key === 'isVertical'
    );
    const minAndMaxVerifKeys = (
      key === 'init'
      || key === 'minValue'
      || key === 'maxValue'
      || key === 'customValues'
    );

    if (setValueVerifKeys) this.setBackgroundTheRange(options);
    if (key === 'secondColor' || key === 'init') this.setBackgroundForSlider(options);
    if (key === 'isVertical' || key === 'init') this.setVerticalOrientation(options);
    if (autoMarginVerifKeys) this.setAutoMargins(options);
    if (minAndMaxVerifKeys) this.setMinAndMaxVal(options);
  }

  renderSlider(initSelector) {
    if (!this.$selector) this.$selector = initSelector;

    const $fragmentWithASlider = $(document.createDocumentFragment());
    const $blockSlider = $(document.createElement('div'));
    $blockSlider.addClass('meta-slider js-meta-slider');

    const HTMLBlock = `<div class="meta-slider__progress js-meta-slider__progress"></div>
    <button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_left" data-value="">
      <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_left"></span>
    </button>
    <button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_right" data-value="">
      <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_right"></span>
    </button>
    <div class="meta-slider__scale js-meta-slider__scale"></div>`;

    $blockSlider.html(HTMLBlock);

    $fragmentWithASlider.append($blockSlider);
    this.$selector.append($fragmentWithASlider);
  }

  setMinAndMaxVal(options) {
    const {
      minValue,
      maxValue,
      customValues,
    } = options;

    this.$elemSlider.attr({ 'data-min': minValue, 'data-max': maxValue });

    if (customValues.length > 0) {
      const firstCustomElem = customValues[0];
      const lastCustomElem = customValues[customValues.length - 1];
      this.$elemSlider.attr({ 'data-min_text': firstCustomElem, 'data-max_text': lastCustomElem });
    } else {
      this.$elemSlider.removeAttr('data-min_text data-max_text');
    }
  }

  setAutoMargins(options) {
    const {
      initAutoMargins,
      showMarkers,
      showScale,
      isVertical,
    } = options;
    const verifiableProp = (initAutoMargins && !isVertical);

    if (verifiableProp && showMarkers) {
      const heightMarker = this.$elemMarkers.eq(-1).outerHeight();
      const heightThumb = this.$elemThumbs.eq(-1).outerHeight();

      this.$elemSlider.css('margin-top', `${heightMarker + (heightThumb / 1.5)}px`);
    } else {
      this.$elemSlider.css('margin-top', '');
    }

    if (verifiableProp && showScale) {
      const elemScalePoints = this.$selector.find('.js-meta-slider__scale-point');
      this.$elemSlider.css('margin-bottom', `${elemScalePoints.eq(0).outerHeight() * 3}px`);
    } else {
      this.$elemSlider.css('margin-bottom', '');
    }
  }

  setBackgroundForSlider(options) {
    this.$elemSlider.css('background-color', options.secondColor);
  }

  setVerticalOrientation(options) {
    if (options.isVertical) {
      this.$elemSlider.addClass('meta-slider_vertical');
      this.$selector.addClass('selector-vertical');
    } else {
      this.$elemSlider.removeClass('meta-slider_vertical');
      this.$selector.removeClass('selector-vertical');
    }
  }

  setBackgroundTheRange(options) {
    if (options.showBackground) {
      const { valuesAsPercentageArray, mainColor } = options;
      const [firstPosition, secondPosition] = valuesAsPercentageArray;
      const settingForRange = { left: `${firstPosition}%`, right: `${100 - secondPosition}%`, background: mainColor };

      this.$sliderProgress.css(settingForRange);
    } else {
      this.$sliderProgress.css('background', 'none');
    }
  }

  handleSetSliderValues(event) {
    event.preventDefault();
    const $target = $(event.target);

    if ($target.hasClass('js-meta-slider')) {
      this.notify(event);
    }
  }

  setEventsSlider() {
    this.$elemSlider.on('pointerdown.slider', this.handleSetSliderValues.bind(this));
  }
}

export default ViewSlider;
