import $ from 'jquery';
import Observer from '../patterns/Observer';

class ViewSlider extends Observer {
  init(options) {
    this.$selector = options.$initSelector;
    this.renderSlider(options);
    this.getInfoAboutSlider();
    this.setVerticalOrientation(options);
    this.setEventsSlider();
  }

  renderSlider(options) {
    const {
      secondColor,
      isRange,
      colorThumb,
      colorBorderForThumb,
      colorMarker,
      colorTextForMarker,
      colorBorderForMarker,
    } = options;

    const $fragmentWithASlider = $(document.createDocumentFragment());
    const $blockSlider = $(document.createElement('div'));
    $blockSlider.addClass('meta-slider js-meta-slider').css('background-color', secondColor);

    const propDisplay = isRange ? '' : 'display:none';

    const HTMLBlock = `<div class="meta-slider__progress js-meta-slider__progress"></div>
    <button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_left" style="background-color:${colorThumb}; border-color:${colorBorderForThumb}; ${propDisplay}" data-value="">
      <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_left" style="background-color:${colorMarker}; color: ${colorTextForMarker}; border-color:${colorBorderForMarker}"></span>
    </button>
    <button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_right" style="background-color:${colorThumb}; border-color:${colorBorderForThumb}" data-value="">
      <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_right" style="background-color:${colorMarker}; color: ${colorTextForMarker}; border-color:${colorBorderForMarker}"></span>
    </button>`;

    $blockSlider.html(HTMLBlock);

    $fragmentWithASlider.append($blockSlider);
    this.$selector.append($fragmentWithASlider);
  }

  getInfoAboutSlider() {
    this.$elemSlider = this.$selector.find('.js-meta-slider');
    this.$sliderProgress = this.$selector.find('.js-meta-slider__progress');
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
      this.$sliderProgress.css(' ');
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
