import $ from 'jquery';

class ViewSlider {
  constructor() {
    this.presenter = null;
  }

  registerWith(presenter) {
    this.presenter = presenter;
  }

  init() {
    console.log('Init Slider');
    this.opt = this.presenter.getOptionsObj();
    this.$selector = this.opt.$initSelector;
    this.renderSlider();
    this.getInfoAboutSlider();
    this.setVerticalOrientation();
  }

  renderSlider() {
    const $fragmentWithASlider = $(document.createDocumentFragment());
    const $blockSlider = $(document.createElement('div'));
    $blockSlider.addClass('meta-slider js-meta-slider').css('background-color', this.opt.secondColor);

    const propDisplay = this.opt.isRange ? '' : 'display:none';

    const HTMLBlock = `<div class="meta-slider__progress js-meta-slider__progress"></div>
    <button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_left" style="background-color:${this.opt.mainColor}; border-color:${this.opt.colorBorderForThumb}; ${propDisplay}" data-value="">
      <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_left" style="background-color:${this.opt.colorMarker}; color: ${this.opt.colorTextForMarker}; border-color:${this.opt.colorBorderForMarker}"></span>
    </button>
    <button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_right" style="background-color:${this.opt.mainColor}; border-color:${this.opt.colorBorderForThumb}" data-value="">
      <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_right" style="background-color:${this.opt.colorMarker}; color: ${this.opt.colorTextForMarker}; border-color:${this.opt.colorBorderForMarker}"></span>
    </button>`;

    $blockSlider.html(HTMLBlock);

    $fragmentWithASlider.append($blockSlider);
    this.$selector.append($fragmentWithASlider);
  }

  getInfoAboutSlider() {
    this.$elemSlider = this.$selector.find('.js-meta-slider');
    this.$sliderProgress = this.$selector.find('.js-meta-slider__progress');

    this.presenter.setProp('$elemSlider', this.$elemSlider);
  }

  setVerticalOrientation() {
    if (this.opt.isVertical) {
      this.presenter.setProp('initAutoMargins', false);
      this.$elemSlider.addClass('meta-slider_vertical');
    }
  }
}

export default ViewSlider;
