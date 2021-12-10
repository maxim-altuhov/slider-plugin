import makeThrottlingHandler from '../utils/makeThrottlingHandler';
import Observer from '../patterns/Observer';

class ViewScale extends Observer {
  private _$selector = $();
  private _$elemSlider = $();
  private _$elemScale = $();
  private _$elemScalePoints = $();
  private _scalePointsSize = 0;
  private _mapSkipScalePoints: Map<number, JQuery[]> = new Map();
  private _skipScalePointsArray: JQuery[] = [];
  private _isFirstInit = true;

  update(options: IPluginOptions) {
    if (this._isFirstInit) {
      this._init(options);
      this._isFirstInit = false;
    }

    const { key } = options;

    const renderScaleVerifKeys =
      key === 'init' ||
      key === 'showScale' ||
      key === 'initAutoScaleCreation' ||
      key === 'step' ||
      key === 'stepSizeForScale' ||
      key === 'minValue' ||
      key === 'maxValue' ||
      key === 'calcNumberOfDecimalPlaces' ||
      key === 'numberOfDecimalPlaces' ||
      key === 'customValues' ||
      key === 'initFormatted' ||
      key === 'preFix' ||
      key === 'postFix' ||
      key === 'initScaleAdjustment';

    const styleVerifKeys = key === 'init' || key === 'colorForScale' || key === 'showScale';

    if (renderScaleVerifKeys) {
      this._createScale(options);
      this._checkingScaleSize(options);

      if (key === 'initScaleAdjustment' || key === 'init') this._setEventsWindow(options);
    }

    if (styleVerifKeys) this._setStyleForScale(options);
  }

  // Первоначальная инициализация
  private _init(options: IPluginOptions) {
    const { $selector, $elemSlider, $elemScale } = options;

    this._$selector = $selector;
    this._$elemSlider = $elemSlider;
    this._$elemScale = $elemScale;
  }

  // Рендер шкалы значений
  private _createScale(options: IPluginOptions) {
    if (options.showScale) {
      this._$elemScale.empty();

      const {
        initAutoScaleCreation,
        step,
        stepSizeForScale,
        minValue,
        maxValue,
        customValues,
        initFormatted,
        preFix,
        postFix,
      } = options;

      // prettier-ignore
      const stepSizeValue = initAutoScaleCreation ? step : (stepSizeForScale ?? step);
      const $fragmentWithScale = $(document.createDocumentFragment());
      let currentValue = minValue;

      for (; currentValue <= maxValue; currentValue += stepSizeValue) {
        const isCustomValue = customValues.length > 0;
        const convertedValue = initFormatted ? currentValue.toLocaleString() : currentValue;
        const resultValue = isCustomValue ? customValues[currentValue] : convertedValue;

        const elemScalePoint = `<button type="button" class="meta-slider__scale-point js-meta-slider__scale-point" 
        style="color: inherit" data-value="${currentValue}">${preFix}${resultValue}${postFix}</button>`;

        $fragmentWithScale.append(elemScalePoint);
      }

      this._$elemScale.append($fragmentWithScale);

      this._$elemScalePoints = this._$selector.find('.js-meta-slider__scale-point');
      this._scalePointsSize = 0;

      this._$elemScalePoints.each((_, scalePoint) => {
        const $scalePoint = $(scalePoint);
        const valueInScalePoint = Number($scalePoint.attr('data-value'));

        const resultValue = (valueInScalePoint - minValue) / (maxValue - minValue);
        this._scalePointsSize += $scalePoint.outerWidth() || 0;

        $scalePoint.css('left', `${resultValue * 100}%`);
      });

      if (this._mapSkipScalePoints && this._mapSkipScalePoints.size > 0) {
        this._mapSkipScalePoints.clear();
      }

      this._setEventsScalePoints();
    }
  }

  private _setStyleForScale(options: IPluginOptions) {
    const { colorForScale, showScale } = options;

    if (showScale) {
      this._$elemScale.css({
        borderColor: colorForScale,
        color: colorForScale,
        opacity: 1,
        'pointer-events': '',
      });

      this._$elemScale.children().removeAttr('tabindex');
    } else {
      this._$elemScale.css({ opacity: 0, 'pointer-events': 'none' });
      this._$elemScale.children().attr('tabindex', -1);
    }
  }

  /**
   * Метод, который проверяет помещаются ли все деления шкалы на данной длине слайдера.
   * Если нет, то этот метод делает авто-подстройку делений шкалы и скрывает лишние значения
   */
  private _checkingScaleSize(options: IPluginOptions) {
    const { showScale, initScaleAdjustment } = options;

    if (showScale && initScaleAdjustment) {
      const MARGIN_PX = 100;
      const sliderSize = this._$elemSlider.outerWidth() || 0;

      while (this._scalePointsSize + MARGIN_PX > sliderSize) {
        const totalSizeScalePoints = this._scalePointsSize + MARGIN_PX;
        this._skipScalePointsArray = [];
        this._$elemScalePoints = this._$selector.find(
          '.js-meta-slider__scale-point:not(.meta-slider__scale-point_skip)',
        );

        this._scalePointsSize = 0;
        const sizeScalePointsArray = this._$elemScalePoints.length;

        if (sizeScalePointsArray <= 2) break;

        this._$elemScalePoints.each((index, currentScalePoint) => {
          // prettier-ignore
          const firstOrLastIndex = (index === 0) || (index === sizeScalePointsArray - 1);
          const intervalWithoutFirstAndLastIndex = !firstOrLastIndex && sizeScalePointsArray <= 6;

          if (index % 2 !== 0 && sizeScalePointsArray > 6) {
            this._setPropForSkipScalePoint(currentScalePoint);
          } else if (sizeScalePointsArray % 2 !== 0 && sizeScalePointsArray <= 6) {
            this._setPropForSkipScalePoint(currentScalePoint);
          } else if (sizeScalePointsArray % 2 === 0 && intervalWithoutFirstAndLastIndex) {
            this._setPropForSkipScalePoint(currentScalePoint);
          }

          if (!currentScalePoint.classList.contains('meta-slider__scale-point_skip'))
            this._scalePointsSize += currentScalePoint.offsetWidth;
        });

        this._mapSkipScalePoints.set(totalSizeScalePoints, [...this._skipScalePointsArray]);
      }

      this._checkingSkipScalePointSize(sliderSize, MARGIN_PX);
    }
  }

  // Установка свойств для пропущенных делений шкалы
  private _setPropForSkipScalePoint(currentScalePoint: HTMLElement) {
    const $currentScalePoint = $(currentScalePoint);
    $currentScalePoint
      .addClass('meta-slider__scale-point_skip')
      .attr('tabindex', -1)
      .css({ color: 'transparent', borderColor: 'inherit' });

    this._skipScalePointsArray.push($currentScalePoint);
  }

  /**
   * Метод отслеживает размер слайдера и возвращает скрытые деления шкалы,
   * если они уже помещаются на шкале
   */
  private _checkingSkipScalePointSize(sliderSize: number, margin: number) {
    this._mapSkipScalePoints.forEach((scalePointSkipArray, controlSize) => {
      if (sliderSize > controlSize + margin / 3) {
        scalePointSkipArray.forEach(($scalePoint) => {
          $scalePoint
            .removeAttr('tabindex')
            .removeClass('meta-slider__scale-point_skip')
            .css({ color: 'inherit', borderColor: '' });

          this._scalePointsSize += $scalePoint.outerWidth() || 0;
        });

        this._mapSkipScalePoints.delete(controlSize);
      }
    });
  }

  // Обработчик события отслеживающий размер окна браузера для метода checkingScaleSize()
  private _setEventsWindow(options: IPluginOptions) {
    const { showScale, initScaleAdjustment } = options;
    const sliderID = this._$elemSlider.attr('data-id');

    if (showScale && initScaleAdjustment) {
      $(window).on(
        `resize.scale-${sliderID}`,
        makeThrottlingHandler(this._handleCheckingScaleSize.bind(this, options), 250),
      );
    } else {
      $(window).off(`resize.scale-${sliderID}`);
    }
  }

  // Отслеживает ширину слайдера
  private _handleCheckingScaleSize(options: IPluginOptions) {
    this._checkingScaleSize(options);
  }

  // Обрабочик событий кликов на значения шкалы
  private _setEventsScalePoints() {
    this._$elemScalePoints.each((_, elemPoint) => {
      $(elemPoint).on('click.scalePoint', this._handleGetValueInScalePoint.bind(this));
    });
  }

  // Получает значения при клике на шкалу слайдера
  private _handleGetValueInScalePoint(event: Event & { target: EventTarget }) {
    event.preventDefault();
    const $target = $(event.target);
    const targetValue = Number($target.attr('data-value'));

    this.notify(event, targetValue);
  }
}

export default ViewScale;
