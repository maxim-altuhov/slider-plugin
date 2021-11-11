import $ from 'jquery';
import Observer from '../patterns/Observer';

class ViewSlider extends Observer {
  isFirstInit: boolean;
  $selector: JQuery;
  $elemSlider: JQuery;
  $sliderProgress: JQuery;
  $elemThumbs: JQuery;
  $elemMarkers: JQuery;

  constructor() {
    super();
    this.isFirstInit = true;
  }

  // Обновление view
  update(options: IPluginOptions) {
    if (this.isFirstInit) {
      this._init(options);
      this.isFirstInit = false;
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
  renderSlider(initSelector: JQuery) {
    if (!this.$selector) this.$selector = initSelector;

    const $fragmentWithASlider = $(document.createDocumentFragment());
    const $blockSlider = $(document.createElement('div'));
    $blockSlider.addClass('meta-slider js-meta-slider');

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
    this.$selector.append($fragmentWithASlider);
  }

  // Первоначальная инициализация
  private _init(options: IPluginOptions) {
    this.$elemSlider = options.$elemSlider;
    this.$sliderProgress = options.$sliderProgress;
    this.$elemThumbs = options.$elemThumbs;
    this.$elemMarkers = options.$elemMarkers;
    this._setEventsSlider();
  }

  // Устанвливает data-атрибуты с мин. и макс. значениями слайдера
  private _setMinAndMaxVal(options: IPluginOptions) {
    const { minValue, maxValue, customValues } = options;

    this.$elemSlider.attr({ 'data-min': minValue, 'data-max': maxValue });

    if (customValues.length > 0) {
      const firstCustomElem = customValues[0];
      const lastCustomElem = customValues[customValues.length - 1];
      this.$elemSlider.attr({ 'data-min_text': firstCustomElem, 'data-max_text': lastCustomElem });
    } else {
      this.$elemSlider.removeAttr('data-min_text data-max_text');
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
      const heightMarker = this.$elemMarkers.eq(-1).outerHeight();
      const heightThumb = this.$elemThumbs.eq(-1).outerHeight();

      this.$elemSlider.css('margin-top', `${heightMarker + heightThumb / 1.5}px`);
    } else {
      this.$elemSlider.css('margin-top', '');
    }

    if (verifProp && showScale) {
      const elemScalePoints = this.$selector.find('.js-meta-slider__scale-point');
      this.$elemSlider.css('margin-bottom', `${elemScalePoints.eq(0).outerHeight() * 3}px`);
    } else {
      this.$elemSlider.css('margin-bottom', '');
    }
  }

  // Установка фонового цвета для слайдера
  private _setBackgroundForSlider(options: IPluginOptions) {
    this.$elemSlider.css('background-color', options.secondColor);
  }

  // Сброс или установка вертикальной ориентации слайдера
  private _setVerticalOrientation(options: IPluginOptions) {
    if (options.isVertical) {
      this.$elemSlider.addClass('meta-slider_vertical');
      this.$selector.addClass('ms-vertical');
    } else {
      this.$elemSlider.removeClass('meta-slider_vertical');
      this.$selector.removeClass('ms-vertical');
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

      this.$sliderProgress.css(settingForRange);
    } else {
      this.$sliderProgress.css('background', 'none');
    }
  }

  // Обработчик события клика внутри слайдера
  private _setEventsSlider() {
    this.$elemSlider.on('pointerdown.slider', this._handleSetSliderValues.bind(this));
  }

  // Получает значения при клике внутри слайдера
  private _handleSetSliderValues(event: IEvent) {
    event.preventDefault();
    const $target = $(event.target);

    if ($target.hasClass('js-meta-slider')) {
      this.notify(event);
    }
  }
}

export default ViewSlider;
