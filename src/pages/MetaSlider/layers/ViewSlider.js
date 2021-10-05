import $ from 'jquery';

class ViewSlider {
  constructor() {
    this.presenter = null;
  }

  init() {
    this.$selector = this.getProp('$initSelector');
    this.renderSlider();
    this.getInfoAboutSlider();
    this.setVerticalOrientation();
    this.setEventsSlider();
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

  renderSlider() {
    const colorThumb = this.getProp('colorThumb');
    const colorBorderForThumb = this.getProp('colorBorderForThumb');
    const colorMarker = this.getProp('colorMarker');
    const colorTextForMarker = this.getProp('colorTextForMarker');
    const colorBorderForMarker = this.getProp('colorBorderForMarker');

    const $fragmentWithASlider = $(document.createDocumentFragment());
    const $blockSlider = $(document.createElement('div'));
    $blockSlider.addClass('meta-slider js-meta-slider').css('background-color', this.getProp('secondColor'));

    const propDisplay = this.getProp('isRange') ? '' : 'display:none';

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

    this.setProp('$elemSlider', this.$elemSlider);
  }

  setVerticalOrientation() {
    if (this.getProp('isVertical')) {
      this.setProp('initAutoMargins', false);
      this.$elemSlider.addClass('meta-slider_vertical');
    }
  }

  setBackgroundTheRange() {
    if (this.getProp('showBackground')) {
      const valuesAsPercentageArray = this.getProp('valuesAsPercentageArray');
      const mainColor = this.getProp('mainColor');
      const [firstPosition, secondPosition] = valuesAsPercentageArray;
      const settingForRange = { left: `${firstPosition}%`, right: `${100 - secondPosition}%`, background: mainColor };

      this.$sliderProgress.css(settingForRange);
    }
  }

  handleSetSliderValues(event) {
    event.preventDefault();
    const $target = $(event.target);

    if ($target.hasClass('js-meta-slider')) {
      const calculateTargetValue = this.presenter.calcTargetValue(event);

      this.presenter.checkTargetValue(calculateTargetValue, event);
    }
  }

  setEventsSlider() {
    this.$elemSlider.on('pointerdown.slider', this.handleSetSliderValues.bind(this));
  }
}

export default ViewSlider;
