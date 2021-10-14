import $ from 'jquery';
import Observer from '../patterns/Observer';

class ViewSlider extends Observer {
  init(options) {
    this.$elemSlider = options.$elemSlider;
    this.$sliderProgress = options.$sliderProgress;
    this.$elemThumbs = options.$elemThumbs;
    this.$elemMarkers = options.$elemMarkers;
    this.setEventsSlider();
  }

  update(options) {
    const { key } = options;
    const verificationKeys = (
      key === 'init'
      || key === 'showBackground'
      || key === 'changedValue'
      || key === 'initValueFirst'
      || key === 'initValueSecond'
    );
    const autoMarginVerificationKeys = (
      key === 'init'
      || key === 'initAutoMargins'
      || key === 'showMarkers'
    );

    if (verificationKeys) this.setBackgroundTheRange(options);

    if (key === 'isVertical' || key === 'init') this.setVerticalOrientation(options);
    if (key === 'isRange' || key === 'init') this.checkIsRange(options);
    if (key === 'secondColor' || key === 'init') this.setBackgroundForSlider(options);
    if (autoMarginVerificationKeys) this.setAutoMargins(options);
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
    </button>`;

    $blockSlider.html(HTMLBlock);

    $fragmentWithASlider.append($blockSlider);
    this.$selector.append($fragmentWithASlider);
  }

  setAutoMargins(options) {
    const {
      initAutoMargins,
      showMarkers,
    } = options;

    if (initAutoMargins && showMarkers) {
      const heightMarker = this.$elemMarkers.eq(-1).outerHeight();
      const heightThumb = this.$elemThumbs.eq(-1).outerHeight();

      this.$elemSlider.css('margin-top', `${heightMarker + (heightThumb / 1.5)}px`);
    } else {
      this.$elemSlider.css('margin-top', '');
    }
  }

  setBackgroundForSlider(options) {
    this.$elemSlider.css('background-color', options.secondColor);
  }

  checkIsRange(options) {
    if (options.isRange) {
      this.$elemThumbs.eq(0).css('display', '');
    } else {
      this.$elemThumbs.eq(0).css('display', 'none');
    }
  }

  setVerticalOrientation(options) {
    if (options.isVertical) {
      this.$elemSlider.addClass('meta-slider_vertical');
    } else {
      this.$elemSlider.removeClass('meta-slider_vertical');
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
