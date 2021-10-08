import $ from 'jquery';
class ViewMarkers {
  init(options) {
    this.$selector = options.$initSelector;
    this.$elemSlider = this.$selector.find('.js-meta-slider');
    this.$elemThumbs = this.$selector.find('.js-meta-slider__thumb');
    this.$elemMarkers = this.$selector.find('.js-meta-slider__marker');
  }

  setValueInMarkers(options) {
    this.$elemSlider.css('margin-top', '');
    this.$elemMarkers.each((index, elem) => {
      $(elem).css('display', 'none');
    });

    if (options.showMarkers) {
      const {
        initAutoMargins,
        customValues,
        preFix,
        postFix,
        numberOfDecimalPlaces,
        initFormatted,
      } = options;

      this.$elemMarkers.each((index, marker) => {
        const $currentMarker = $(marker);

        if (customValues.length > 0) {
          $currentMarker.text(`${preFix}${this.$elemThumbs.eq(index).attr('data-text')}${postFix}`);
        } else {
          const currentValue = Number(this.$elemThumbs.eq(index).attr('data-value'));
          const checkedValue = Number(currentValue.toFixed(numberOfDecimalPlaces));
          const convertedValue = initFormatted ? checkedValue.toLocaleString() : checkedValue;

          $currentMarker.text(`${preFix}${convertedValue}${postFix}`);
        }

        $currentMarker.css('display', '');

        if (initAutoMargins) {
          this.heightMarker = this.$elemMarkers.eq(-1).outerHeight();
          this.heightThumb = this.$elemThumbs.eq(-1).outerHeight();
          this.$elemSlider.css('margin-top', `${this.heightMarker + (this.heightThumb / 1.5)}px`);
        }
      });
    }
  }
}

export default ViewMarkers;
