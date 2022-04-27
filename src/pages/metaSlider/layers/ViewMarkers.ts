class ViewMarkers {
  private _$elemMarkers = $();
  private _$elemThumbs = $();
  private _isFirstInit = true;
  private readonly _verifKeysObj = {
    setValueKeys: [
      'init',
      'changedValue',
      'initValueFirst',
      'initValueSecond',
      'customValues',
      'preFix',
      'postFix',
      'calcNumberOfDecimalPlaces',
      'numberOfDecimalPlaces',
      'initFormatted',
      'isRange',
      'minValue',
      'maxValue',
      'step',
    ],
    setStyleKeys: [
      'init',
      'showMarkers',
      'mainColor',
      'colorMarker',
      'colorTextForMarker',
      'colorBorderForMarker',
    ],
  };

  update(options: IPluginOptions) {
    if (this._isFirstInit) {
      this._init(options);
      this._isFirstInit = false;
    }

    const { key } = options;
    const { setValueKeys, setStyleKeys } = this._verifKeysObj;

    if (setValueKeys.includes(key)) this._setValueInMarkers(options);
    if (setStyleKeys.includes(key)) this._setStyleForMarkers(options);
  }

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
          const convertedValue = initFormatted ? currentValue.toLocaleString() : currentValue;

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
    const styleProp = {
      display: '',
      color: colorTextForMarker,
      'background-color': backgroundColor,
      'border-color': colorBorderForMarker,
    };

    if (showMarkers) {
      this._$elemMarkers.css(styleProp);
    } else {
      this._$elemMarkers.css('display', 'none');
    }
  }
}

export default ViewMarkers;
