import $ from 'jquery';
import Observer from '../patterns/Observer';

class ViewScale extends Observer {
  $selector!: JQuery;
  $elemSlider!: JQuery;
  $elemScale!: JQuery;
  $elemScalePoints!: JQuery;
  scalePointsSize!: number;
  mapSkipScalePoints!: Map<number, JQuery[]>;
  skipScalePointsArray!: JQuery[];

  constructor(public isFirstInit: boolean = true) {
    super();
  }

  // Обновление view
  update(options: IPluginOptions) {
    if (this.isFirstInit) {
      this._init(options);
      this.isFirstInit = false;
    }

    const { key } = options;

    // prettier-ignore
    const renderScaleVerifKeys = (
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
      key === 'initScaleAdjustment'
    );

    // prettier-ignore
    const styleVerifKeys = (key === 'init' || key === 'colorForScale' || key === 'showScale');

    if (renderScaleVerifKeys) {
      this._createScale(options);
      this._checkingScaleSize(options);

      if (key === 'initScaleAdjustment' || key === 'init') this._setEventsWindow(options);
    }

    if (styleVerifKeys) this._setStyleForScale(options);
  }

  // Первоначальная инициализация
  private _init(options: IPluginOptions) {
    this.$selector = options.$selector;
    this.$elemSlider = options.$elemSlider;
    this.$elemScale = options.$elemScale;
  }

  // Рендер шкалы значений
  private _createScale(options: IPluginOptions) {
    if (options.showScale) {
      this.$elemScale.empty();

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

      const $fragmentWithScale = $(document.createDocumentFragment());
      const stepSizeValue = initAutoScaleCreation ? step : stepSizeForScale;
      let currentValue = minValue;

      for (; currentValue <= maxValue; currentValue += stepSizeValue!) {
        const isCustomValue = customValues.length > 0;
        const convertedValue = initFormatted ? currentValue.toLocaleString() : currentValue;
        const resultValue = isCustomValue ? customValues[currentValue] : convertedValue;

        const elemScalePoint = `<button type="button" class="meta-slider__scale-point js-meta-slider__scale-point" 
        style="color: inherit" data-value="${currentValue}">${preFix}${resultValue}${postFix}</button>`;

        $fragmentWithScale.append(elemScalePoint);
      }

      this.$elemScale.append($fragmentWithScale);

      this.$elemScalePoints = this.$selector.find('.js-meta-slider__scale-point');
      this.scalePointsSize = 0;

      this.$elemScalePoints.each((_, scalePoint) => {
        const $scalePoint = $(scalePoint);
        const valueInScalePoint = Number($scalePoint.attr('data-value'));

        const resultValue = (valueInScalePoint - minValue) / (maxValue - minValue);
        this.scalePointsSize += $scalePoint.outerWidth()!;

        $scalePoint.css('left', `${resultValue * 100}%`);
      });

      if (this.mapSkipScalePoints && this.mapSkipScalePoints.size > 0) {
        this.mapSkipScalePoints.clear();
      } else {
        this.mapSkipScalePoints = new Map();
      }

      this._setEventsScalePoints();
    }
  }

  // Устанавливаем стили для шкалы
  private _setStyleForScale(options: IPluginOptions) {
    const { colorForScale, showScale } = options;

    if (showScale) {
      this.$elemScale.css({
        borderColor: colorForScale,
        color: colorForScale,
        opacity: 1,
        'pointer-events': '',
      });

      this.$elemScale.children().removeAttr('tabindex');
    } else {
      this.$elemScale.css({ opacity: 0, 'pointer-events': 'none' });
      this.$elemScale.children().attr('tabindex', -1);
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
      const sliderSize = this.$elemSlider.outerWidth()!;

      while (this.scalePointsSize + MARGIN_PX > sliderSize) {
        const totalSizeScalePoints = this.scalePointsSize + MARGIN_PX;
        this.skipScalePointsArray = [];
        this.$elemScalePoints = this.$selector.find(
          '.js-meta-slider__scale-point:not(.meta-slider__scale-point_skip)',
        );

        this.scalePointsSize = 0;
        const sizeScalePointsArray = this.$elemScalePoints.length;

        if (sizeScalePointsArray <= 2) break;

        this.$elemScalePoints.each((index, scalePoint) => {
          const $currentScalePoint = $(scalePoint);
          const firstOrLastIndex = index === 0 || index === sizeScalePointsArray - 1;
          const intervalWithoutFirstAndLastIndex = !firstOrLastIndex && sizeScalePointsArray <= 6;

          if (index % 2 !== 0 && sizeScalePointsArray > 6) {
            this._setPropForSkipScalePoint($currentScalePoint);
          } else if (sizeScalePointsArray % 2 !== 0 && sizeScalePointsArray <= 6) {
            this._setPropForSkipScalePoint($currentScalePoint);
          } else if (sizeScalePointsArray % 2 === 0 && intervalWithoutFirstAndLastIndex) {
            this._setPropForSkipScalePoint($currentScalePoint);
          }

          if (!$currentScalePoint.hasClass('meta-slider__scale-point_skip'))
            this.scalePointsSize += $currentScalePoint.outerWidth()!;
        });

        this.mapSkipScalePoints.set(totalSizeScalePoints, [...this.skipScalePointsArray]);
      }

      this._checkingSkipScalePointSize(sliderSize, MARGIN_PX);
    }
  }

  // Установка стилей для пропущенных делений шкалы
  private _setPropForSkipScalePoint($scalePoint: JQuery) {
    $scalePoint
      .addClass('meta-slider__scale-point_skip')
      .attr('tabindex', -1)
      .css({ color: 'transparent', borderColor: 'inherit' });

    this.skipScalePointsArray.push($scalePoint);
  }

  /**
   * Метод отслеживает размер слайдера и возвращает скрытые деления шкалы,
   * если они уже помещаются на шкале
   */
  private _checkingSkipScalePointSize(sliderSize: number, margin: number) {
    this.mapSkipScalePoints.forEach((scalePointSkipArray, controlSize) => {
      if (sliderSize > controlSize + margin / 3) {
        scalePointSkipArray.forEach(($scalePoint) => {
          $scalePoint
            .removeAttr('tabindex')
            .removeClass('meta-slider__scale-point_skip')
            .css({ color: 'inherit', borderColor: '' });

          this.scalePointsSize += $scalePoint.outerWidth()!;
        });

        this.mapSkipScalePoints.delete(controlSize);
      }
    });
  }

  // Обработчик события отслеживающий размер окна браузера для метода checkingScaleSize()
  private _setEventsWindow(options: IPluginOptions) {
    const { showScale, initScaleAdjustment } = options;
    const sliderID = this.$elemSlider.attr('data-id');

    if (showScale && initScaleAdjustment) {
      $(window).on(
        `resize.scale-${sliderID}`,
        ViewScale._makeThrottlingHandler(this._handleCheckingScaleSize.bind(this, options), 250),
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
    this.$elemScalePoints.each((_, elemPoint) => {
      $(elemPoint).on('click.scalePoint', this._handleGetValueInScalePoint.bind(this));
    });
  }

  // Получает значения при клике на шкалу слайдера
  private _handleGetValueInScalePoint(event: Event) {
    event.preventDefault();
    const $target = $(event.target as HTMLButtonElement);
    const targetValue = Number($target.attr('data-value'));

    this.notify(event, targetValue);
  }

  // throttling декоратор
  private static _makeThrottlingHandler(fn: Function, timeout: number) {
    let timer: NodeJS.Timeout | null = null;

    return (...args: any[]) => {
      if (timer) return;

      timer = setTimeout(() => {
        fn(...args);
        clearTimeout(timer!);
        timer = null;
      }, timeout);
    };
  }
}

export default ViewScale;
