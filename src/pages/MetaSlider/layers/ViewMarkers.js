import $ from 'jquery';
class ViewMarkers {
  init(options) {
    this.$selector = options.$selector;
    this.$elemSlider = options.$elemSlider;
    this.$elemThumbs = options.$elemThumbs;
    this.$elemMarkers = options.$elemMarkers;
  }

  update(options) {
    const { key } = options;

    const verificationKeys = (
      key === 'init'
      || key === 'changedValue'
      || key === 'initValueFirst'
      || key === 'initValueSecond'
      || key === 'customValues'
      || key === 'preFix'
      || key === 'postFix'
      || key === 'numberOfDecimalPlaces'
      || key === 'initFormatted'
    );
    const styleVerificationKeys = (
      key === 'init'
      || key === 'showMarkers'
      || key === 'colorMarker'
      || key === 'colorTextForMarker'
      || key === 'colorBorderForMarker'
    );

    if (verificationKeys) this.setValueInMarkers(options);
    if (styleVerificationKeys) this.setStyleForMarkers(options);
  }

  setStyleForMarkers(options) {
    const {
      showMarkers,
      colorMarker,
      colorTextForMarker,
      colorBorderForMarker,
    } = options;

    this.$elemMarkers.each((index, marker) => {
      const $currentMarker = $(marker);
      const styleProp = {
        display: '',
        color: colorTextForMarker,
        'background-color': colorMarker,
        'border-color': colorBorderForMarker,
      };

      if (showMarkers) {
        $currentMarker.css(styleProp);
      } else {
        $currentMarker.css('display', 'none');
      }
    });
  }

  setValueInMarkers(options) {
    if (options.showMarkers) {
      const {
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
      });
    }
  }
}

export default ViewMarkers;
