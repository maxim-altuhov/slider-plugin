import $ from 'jquery';
import Observer from '../patterns/Observer';

class ViewMinAndMaxValues extends Observer {
  init(options) {
    this.$selector = options.$selector;
    this.$elemSlider = options.$elemSlider;
    this.setMinAndMaxValues(options);
    this.setEventsMinAndMaxValues();
  }

  setMinAndMaxValues(options) {
    const {
      customValues,
      minValue,
      maxValue,
      showMinAndMax,
      colorTextForMinAndMax,
      minAndMaxArray,
      initFormatted,
      numberOfDecimalPlaces,
      preFix,
      postFix,
      initAutoMargins,
    } = options;

    this.$elemSlider.css('margin-bottom', '').attr({ 'data-min': minValue, 'data-max': maxValue });

    if (customValues.length > 0) {
      const firstCustomElem = customValues[0];
      const lastCustomElem = customValues[customValues.length - 1];
      this.$elemSlider.attr({ 'data-min_text': firstCustomElem, 'data-max_text': lastCustomElem });
    }

    if (showMinAndMax) {
      const HTMLBlockValues = `<button type="button" class="meta-slider__value js-meta-slider__value meta-slider__value_min" style="color: ${colorTextForMinAndMax}"></button>
      <button type="button" class="meta-slider__value js-meta-slider__value meta-slider__value_max" style="color: ${colorTextForMinAndMax}"></button>`;
      this.$elemSlider.append(HTMLBlockValues);

      this.$elemMinAndMaxValues = this.$selector.find('.js-meta-slider__value');

      this.$elemMinAndMaxValues.each((index, currentElem) => {
        const $currentElem = $(currentElem);
        const currentValue = minAndMaxArray[index];

        if (customValues.length === 0) {
          let convertedValue = initFormatted
            ? currentValue.toLocaleString()
            : currentValue.toFixed(numberOfDecimalPlaces);

          $currentElem.text(`${preFix}${convertedValue}${postFix}`).attr('data-value', currentValue);
        } else {
          $currentElem.text(`${preFix}${currentValue}${postFix}`);
          if (index === 0) $currentElem.attr('data-value', 0);
          if (index === 1) $currentElem.attr('data-value', customValues.length - 1);
        }
      });

      if (initAutoMargins) this.$elemSlider.css('margin-bottom', `${this.$elemMinAndMaxValues.eq(0).outerHeight() * 2}px`);
    }
  }

  handleGetMinOrMaxValue(event) {
    event.preventDefault();
    const $target = $(event.target);
    const targetValue = Number($target.attr('data-value'));
    this.notify(event, targetValue);
  }

  setEventsMinAndMaxValues() {
    if (this.$elemMinAndMaxValues) {
      this.$elemMinAndMaxValues.each((index, elem) => {
        $(elem).on('click.minAndMaxValue', this.handleGetMinOrMaxValue.bind(this));
      });
    }
  }
}

export default ViewMinAndMaxValues;
