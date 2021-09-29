import $ from 'jquery';

class ViewMarkers {
  constructor() {
    this.presenter = null;
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

  init() {
    console.log('Init Markers');
    this.$selector = this.getProp('$initSelector');
    this.getInfoAboutMarkers();
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
      if (this.initAutoMargins) this.$elemSlider.css('margin-top', `${this.heightMarker + (this.heightThumb / 1.5)}px`);

      this.$elemMarkers.each((index, marker) => {
        const $currentMarker = $(marker);

        if (this.customValues.length > 0) {
          $currentMarker.text(`${this.preFix}${this.$elemThumbs.eq(index).attr('data-text')}${this.postFix}`);
        } else {
          const currentValue = Number(this.$elemThumbs.eq(index).attr('data-value'));
          const checkedValue = Number(currentValue.toFixed(this.numberOfDecimalPlaces));
          const convertedValue = this.initFormatted ? checkedValue.toLocaleString() : checkedValue;

          $currentMarker.text(`${this.preFix}${convertedValue}${this.postFix}`);
        }

        $currentMarker.css('display', '');
      });
    }
  }
}

export default ViewMarkers;
