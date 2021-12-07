class ViewMarkers {
  private _$elemMarkers = $();
  private _$elemThumbs = $();
  private _isFirstInit = true;

  update(options: IPluginOptions) {
    if (this._isFirstInit) {
      this._init(options);
      this._isFirstInit = false;
    }

    const { key } = options;

    const setValueVerifKeys =
      key === 'init' ||
      key === 'changedValue' ||
      key === 'initValueFirst' ||
      key === 'initValueSecond' ||
      key === 'customValues' ||
      key === 'preFix' ||
      key === 'postFix' ||
      key === 'calcNumberOfDecimalPlaces' ||
      key === 'numberOfDecimalPlaces' ||
      key === 'initFormatted' ||
      key === 'isRange' ||
      key === 'minValue' ||
      key === 'maxValue' ||
      key === 'step';

    const styleVerifKeys =
      key === 'init' ||
      key === 'showMarkers' ||
      key === 'mainColor' ||
      key === 'colorMarker' ||
      key === 'colorTextForMarker' ||
      key === 'colorBorderForMarker';

    if (setValueVerifKeys) this._setValueInMarkers(options);
    if (styleVerifKeys) this._setStyleForMarkers(options);
  }

  // Первоначальная инициализация
  private _init(options: IPluginOptions) {
    const { $elemThumbs, $elemMarkers } = options;

    this._$elemThumbs = $elemThumbs;
    this._$elemMarkers = $elemMarkers;
  }

  private _setValueInMarkers(options: IPluginOptions) {
    if (options.showMarkers) {
      // prettier-ignore
      const { 
        customValues,
        preFix,
        postFix,
        numberOfDecimalPlaces,
        initFormatted,
      } = options;

      this._$elemMarkers.each((index, marker) => {
        const $currentMarker = $(marker);

        if (customValues.length > 0) {
          $currentMarker.text(
            `${preFix}${this._$elemThumbs.eq(index).attr('data-text')}${postFix}`,
          );
        } else {
          const currentValue = Number(this._$elemThumbs.eq(index).attr('data-value'));
          const checkedValue = Number(currentValue.toFixed(numberOfDecimalPlaces));
          const convertedValue = initFormatted ? checkedValue.toLocaleString() : checkedValue;

          $currentMarker.text(`${preFix}${convertedValue}${postFix}`);
        }
      });
    }
  }

  private _setStyleForMarkers(options: IPluginOptions) {
    // prettier-ignore
    const {
      mainColor,
      showMarkers,
      colorMarker,
      colorTextForMarker,
      colorBorderForMarker,
    } = options;

    const backgroundColor = colorMarker || mainColor;

    this._$elemMarkers.each((_, marker) => {
      const $currentMarker = $(marker);
      const styleProp = {
        display: '',
        color: colorTextForMarker,
        'background-color': backgroundColor,
        'border-color': colorBorderForMarker,
      };

      if (showMarkers) {
        $currentMarker.css(styleProp);
      } else {
        $currentMarker.css('display', 'none');
      }
    });
  }
}

export default ViewMarkers;
