import $ from 'jquery';

class ViewMinAndMaxValue {
  constructor() {
    this.presenter = null;
  }

  registerWith(presenter) {
    this.presenter = presenter;
  }

  init() {
    console.log('Init MinAndMaxValues');
    this.opt = this.presenter.getOptionsObj();
    this.$selector = this.opt.$initSelector;
  }

  setMinAndMaxValues() {
    this.$elemSlider.css('margin-bottom', '').attr({ 'data-min': this.minValue, 'data-max': this.maxValue });

    if (this.customValues.length > 0) {
      const firstCustomElem = this.customValues[0];
      const lastCustomElem = this.customValues[this.customValues.length - 1];
      this.$elemSlider.attr({ 'data-min_text': firstCustomElem, 'data-max_text': lastCustomElem });
    }

    if (this.showMinAndMax) {
      const HTMLBlockValues = `<button type="button" class="meta-slider__value js-meta-slider__value meta-slider__value_min" style="color: ${this.colorTextForMinAndMax}"></button>
      <button type="button" class="meta-slider__value js-meta-slider__value meta-slider__value_max" style="color: ${this.colorTextForMinAndMax}"></button>`;
      this.$elemSlider.append(HTMLBlockValues);

      this.$elemMinAndMaxValues = this.$selector.find('.js-meta-slider__value');

      this.$elemMinAndMaxValues.each((index, currentElem) => {
        const $currentElem = $(currentElem);
        const currentValue = this.minAndMaxArray[index];

        if (this.customValues.length === 0) {
          let convertedValue = this.initFormatted
            ? currentValue.toLocaleString()
            : currentValue.toFixed(this.numberOfDecimalPlaces);

          $currentElem.text(`${this.preFix}${convertedValue}${this.postFix}`);
          $currentElem.attr('data-value', currentValue);
        } else {
          $currentElem.text(`${this.preFix}${currentValue}${this.postFix}`);
          if (index === 0) $currentElem.attr('data-value', 0);
          if (index === 1) $currentElem.attr('data-value', this.customValues.length - 1);
        }
      });

      if (this.initAutoMargins) this.$elemSlider.css('margin-bottom', `${this.$elemMinAndMaxValues.eq(0).outerHeight() * 2}px`);
    }
  }

  setEventsSlider() {
    if (this.$elemMinAndMaxValues) {
      this.$elemMinAndMaxValues.each((index, elem) => {
        $(elem).on('click.minAndMaxValue', this.handleGetValueInScalePoint.bind(this));
      });
    }
  }
}

export default ViewMinAndMaxValue;
