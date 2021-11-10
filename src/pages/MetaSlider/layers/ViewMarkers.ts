import $ from 'jquery';

class ViewMarkers {
  isFirstInit: boolean;
  $elemMarkers: JQuery;
  $elemThumbs: JQuery;

  constructor() {
    this.isFirstInit = true;
  }

  // Первоначальная инициализация
  init(options: IPluginOptions) {
    this.$elemThumbs = options.$elemThumbs;
    this.$elemMarkers = options.$elemMarkers;
  }

  // Обновление view
  update(options: IPluginOptions) {
    if (this.isFirstInit) {
      this.init(options);
      this.isFirstInit = false;
    }

    const { key } = options;

    // prettier-ignore
    const setValueVerifKeys = (
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
      key === 'step'
    );

    // prettier-ignore
    const styleVerifKeys = (
      key === 'init' ||
      key === 'showMarkers' ||
      key === 'mainColor' ||
      key === 'colorMarker' ||
      key === 'colorTextForMarker' ||
      key === 'colorBorderForMarker'
    );

    if (setValueVerifKeys) this.setValueInMarkers(options);
    if (styleVerifKeys) this.setStyleForMarkers(options);
  }

  // Устанавливаем значения в маркеры
  setValueInMarkers(options: IPluginOptions) {
    if (options.showMarkers) {
      // prettier-ignore
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

  // Устанавливаем стили для маркеров
  setStyleForMarkers(options: IPluginOptions) {
    // prettier-ignore
    const {
      mainColor,
      showMarkers,
      colorMarker,
      colorTextForMarker,
      colorBorderForMarker,
    } = options;

    const backgroundColor = colorMarker || mainColor;

    this.$elemMarkers.each((index, marker) => {
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
