import $ from 'jquery';
class ViewMarkers {
  init(options) {
    this.$selector = options.$selector;
    this.$elemSlider = options.$elemSlider;
    this.$elemThumbs = options.$elemThumbs;
    this.$elemMarkers = options.$elemMarkers;
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
          const heightMarker = this.$elemMarkers.eq(-1).outerHeight();
          const heightThumb = this.$elemThumbs.eq(-1).outerHeight();

          this.$elemSlider.css('margin-top', `${heightMarker + (heightThumb / 1.5)}px`);
        }
      });
    }
  }
}

export default ViewMarkers;
