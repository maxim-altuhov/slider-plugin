import Observer from '../patterns/Observer';

class ViewSlider extends Observer {
  private _$selector: undefined | JQuery;
  private _$elemSlider: JQuery;
  private _$sliderProgress: JQuery;
  private _$elemThumbs: JQuery;
  private _$elemMarkers: JQuery;

  constructor(private _isFirstInit: boolean = true) {
    super();
    this._$elemSlider = $();
    this._$sliderProgress = $();
    this._$elemThumbs = $();
    this._$elemMarkers = $();
  }

  // Обновление view
  update(options: IPluginOptions) {
    if (this._isFirstInit) {
      this._init(options);
      this._isFirstInit = false;
    }

    const { key } = options;

    // prettier-ignore
    const setValueVerifKeys = (
      key === 'init' ||
      key === 'showBackground' ||
      key === 'mainColor' ||
      key === 'changedValue' ||
      key === 'initValueFirst' ||
      key === 'initValueSecond' ||
      key === 'isRange' ||
      key === 'minValue' ||
      key === 'maxValue' ||
      key === 'customValues' ||
      key === 'step' ||
      key === 'calcNumberOfDecimalPlaces' ||
      key === 'numberOfDecimalPlaces'
    );

    // prettier-ignore
    const autoMarginVerifKeys = (
      key === 'init' ||
      key === 'initAutoMargins' ||
      key === 'showMarkers' ||
      key === 'showScale' ||
      key === 'isVertical'
    );

    // prettier-ignore
    const minAndMaxVerifKeys = (
      key === 'init' ||
      key === 'minValue' ||
      key === 'maxValue' ||
      key === 'customValues'
    );

    if (setValueVerifKeys) this._setBackgroundTheRange(options);
    if (key === 'secondColor' || key === 'init') this._setBackgroundForSlider(options);
    if (key === 'isVertical' || key === 'init') this._setVerticalOrientation(options);
    if (autoMarginVerifKeys) this._setAutoMargins(options);
    if (minAndMaxVerifKeys) this._setMinAndMaxVal(options);
  }

  // Первоначальный рендер слайдера
  renderSlider($initSelector: JQuery) {
    if (!this._$selector) this._$selector = $initSelector;

    const $fragmentWithASlider = $(document.createDocumentFragment());
    const $blockSlider = $(document.createElement('div'));
    const sliderID = ViewSlider._createUniqueID();

    $blockSlider.addClass('meta-slider js-meta-slider');
    $blockSlider.attr('data-id', sliderID);

    const HTMLBlock = `<div class="meta-slider__progress js-meta-slider__progress"></div>
    <button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_left" data-value="">
      <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_left"></span>
    </button>
    <button type="button" class="meta-slider__thumb js-meta-slider__thumb meta-slider__thumb_right" data-value="">
      <span class="meta-slider__marker js-meta-slider__marker meta-slider__marker_right"></span>
    </button>
    <div class="meta-slider__scale js-meta-slider__scale"></div>`;

    $blockSlider.html(HTMLBlock);

    $fragmentWithASlider.append($blockSlider);
    this._$selector.append($fragmentWithASlider);
  }

  // создаём уникальный ID для слайдера
  private static _createUniqueID() {
    const IDPartOne = Date.now().toString(36);
    const IDPartTwo = Math.random().toString(36).substring(2);

    return IDPartOne + IDPartTwo;
  }

  // Первоначальная инициализация
  private _init(options: IPluginOptions) {
    // prettier-ignore
    const { 
      $elemSlider,
      $sliderProgress,
      $elemThumbs,
      $elemMarkers,
    } = options;

    this._$elemSlider = $elemSlider;
    this._$sliderProgress = $sliderProgress;
    this._$elemThumbs = $elemThumbs;
    this._$elemMarkers = $elemMarkers;
    this._setEventsSlider();
  }

  // Устанвливает data-атрибуты с мин. и макс. значениями слайдера
  private _setMinAndMaxVal(options: IPluginOptions) {
    const { minValue, maxValue, customValues } = options;

    this._$elemSlider.attr({ 'data-min': minValue, 'data-max': maxValue });

    if (customValues.length > 0) {
      const firstCustomElem = customValues[0];
      const lastCustomElem = customValues[customValues.length - 1];
      this._$elemSlider.attr({ 'data-min_text': firstCustomElem, 'data-max_text': lastCustomElem });
    } else {
      this._$elemSlider.removeAttr('data-min_text data-max_text');
    }
  }

  // Проверка и установка отступов у слайдера
  private _setAutoMargins(options: IPluginOptions) {
    // prettier-ignore
    const { 
      initAutoMargins,
      showMarkers,
      showScale,
      isVertical,
    } = options;

    const verifProp = initAutoMargins && !isVertical;

    if (verifProp && showMarkers) {
      const heightMarker = this._$elemMarkers.eq(-1).outerHeight() || 0;
      const heightThumb = this._$elemThumbs.eq(-1).outerHeight() || 0;

      this._$elemSlider.css('margin-top', `${heightMarker + heightThumb / 1.5}px`);
    } else {
      this._$elemSlider.css('margin-top', '');
    }

    if (verifProp && showScale) {
      const elemScalePoints = this._$selector!.find('.js-meta-slider__scale-point');
      const elemScalePointsHeight = elemScalePoints.outerHeight() || 0;
      this._$elemSlider.css('margin-bottom', `${elemScalePointsHeight * 3}px`);
    } else {
      this._$elemSlider.css('margin-bottom', '');
    }
  }

  // Установка фонового цвета для слайдера
  private _setBackgroundForSlider(options: IPluginOptions) {
    this._$elemSlider.css('background-color', options.secondColor);
  }

  // Сброс или установка вертикальной ориентации слайдера
  private _setVerticalOrientation(options: IPluginOptions) {
    if (options.isVertical) {
      this._$elemSlider.addClass('meta-slider_vertical');
      this._$selector!.addClass('ms-vertical');
    } else {
      this._$elemSlider.removeClass('meta-slider_vertical');
      this._$selector!.removeClass('ms-vertical');
    }
  }

  // Проверка и установка цвета заливки интервала между бегунками
  private _setBackgroundTheRange(options: IPluginOptions) {
    if (options.showBackground) {
      const { valuesAsPercentageArray, mainColor } = options;
      const [firstPosition, secondPosition] = valuesAsPercentageArray;

      const settingForRange = {
        left: `${firstPosition}%`,
        right: `${100 - secondPosition}%`,
        background: mainColor,
      };

      this._$sliderProgress.css(settingForRange);
    } else {
      this._$sliderProgress.css('background', 'none');
    }
  }

  // Обработчик события клика внутри слайдера
  private _setEventsSlider() {
    this._$elemSlider.on('pointerdown.slider', this._handleSetSliderValues.bind(this));
  }

  // Получает значения при клике внутри слайдера
  private _handleSetSliderValues(event: Event) {
    event.preventDefault();
    const $target = $(event.target as HTMLElement);

    if ($target.hasClass('js-meta-slider')) {
      this.notify(event);
    }
  }
}

export default ViewSlider;
