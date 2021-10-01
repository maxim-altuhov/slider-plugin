import $ from 'jquery';

class ViewMarkers {
  constructor() {
    this.presenter = null;
  }

  init() {
    this.$selector = this.getProp('$initSelector');
    this.$elemSlider = this.getProp('$elemSlider');
    this.$elemThumbs = this.getProp('$elemThumbs');
    this.getInfoAboutMarkers();
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

  getInfoAboutMarkers() {
    this.$elemMarkers = this.$selector.find('.js-meta-slider__marker');
    this.heightMarker = this.$elemMarkers.eq(-1).outerHeight();

    this.presenter.setProp('$elemMarkers', this.$elemMarkers);
    this.presenter.setProp('heightMarker', this.heightMarker);
  }

  setValueInMarkers() {
    this.$elemSlider.css('margin-top', '');
    this.$elemMarkers.each((index, elem) => {
      $(elem).css('display', 'none');
    });

    if (this.getProp('showMarkers')) {
      const initAutoMargins = this.getProp('initAutoMargins');
      const heightThumb = this.getProp('heightThumb');
      const customValues = this.getProp('customValues');
      const preFix = this.getProp('preFix');
      const postFix = this.getProp('postFix');
      const numberOfDecimalPlaces = this.getProp('numberOfDecimalPlaces');
      const initFormatted = this.getProp('initFormatted');

      if (initAutoMargins) this.$elemSlider.css('margin-top', `${this.heightMarker + (heightThumb / 1.5)}px`);

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
      });
    }
  }
}

export default ViewMarkers;
