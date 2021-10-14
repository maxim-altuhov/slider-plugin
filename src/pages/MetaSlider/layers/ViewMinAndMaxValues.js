import $ from 'jquery';
import Observer from '../patterns/Observer';

class ViewMinAndMaxValues extends Observer {
  init(options) {
    this.$selector = options.$selector;
    this.$elemSlider = options.$elemSlider;
  }

  update(options) {
    const {
      key,
      minValue,
      maxValue,
      customValues,
      initAutoMargins,
      showMinAndMax,
    } = options;

    const validateKey = (
      key === 'minValue'
      || key === 'maxValue'
      || key === 'initAutoMargins'
      || key === 'showMinAndMax'
      || key === 'customValues'
      || key === 'colorTextForMinAndMax'
      || key === 'preFix'
      || key === 'postFix'
      || key === 'init'
    );

    if (validateKey) {
      if (key === 'minValue' || key === 'maxValue' || key === 'init') this.$elemSlider.attr({ 'data-min': minValue, 'data-max': maxValue });

      if (showMinAndMax) {
        this.setMinAndMaxValues(options);
        this.$elemMinAndMaxValues.css('display', '');
      } else if (this.$elemMinAndMaxValues && !showMinAndMax) {
        this.$elemMinAndMaxValues.css('display', 'none');
      }

      if (initAutoMargins && showMinAndMax) {
        this.$elemSlider.css('margin-bottom', `${this.$elemMinAndMaxValues.eq(0).outerHeight() * 2}px`);
      } else {
        this.$elemSlider.css('margin-bottom', '');
      }

      if (customValues.length > 0) {
        const firstCustomElem = customValues[0];
        const lastCustomElem = customValues[customValues.length - 1];
        this.$elemSlider.attr({ 'data-min_text': firstCustomElem, 'data-max_text': lastCustomElem });
      } else {
        this.$elemSlider.removeAttr('data-min_text data-max_text');
      }
    }
  }

  setMinAndMaxValues(options) {
    const {
      customValues,
      showMinAndMax,
      colorTextForMinAndMax,
      minAndMaxArray,
      initFormatted,
      numberOfDecimalPlaces,
      preFix,
      postFix,
    } = options;

    if (showMinAndMax) {
      if (!this.$elemMinAndMaxValues) {
        const HTMLBlockValues = `<button type="button" class="meta-slider__value js-meta-slider__value meta-slider__value_min"></button>
        <button type="button" class="meta-slider__value js-meta-slider__value meta-slider__value_max"></button>`;
        this.$elemSlider.append(HTMLBlockValues);

        this.$elemMinAndMaxValues = this.$selector.find('.js-meta-slider__value');
        this.setEventsMinAndMaxValues();
      }

      this.$elemMinAndMaxValues.each((index, currentElem) => {
        const $currentElem = $(currentElem);
        const currentValue = minAndMaxArray[index];
        $currentElem.css('color', colorTextForMinAndMax);

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
