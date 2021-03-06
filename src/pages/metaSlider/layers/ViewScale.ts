import makeThrottlingHandler from '../utils/makeThrottlingHandler';
import Observer from '../patterns/Observer';

class ViewScale extends Observer {
  private _$selector = $();
  private _$elemSlider = $();
  private _$elemScale = $();
  private _$elemScalePoints = $();
  private _scalePointsSize = 0;
  private _mapSkipScalePoints: Map<number, JQuery<HTMLElement>[]> = new Map();
  private _skipScalePointsArray: JQuery<HTMLElement>[] = [];
  private _isFirstInit = true;
  private readonly _verifKeysObj = {
    renderScaleKeys: [
      'init',
      'isVertical',
      'showScale',
      'initAutoScaleCreation',
      'step',
      'stepSizeForScale',
      'minValue',
      'maxValue',
      'calcNumberOfDecimalPlaces',
      'numberOfDecimalPlaces',
      'customValues',
      'initFormatted',
      'preFix',
      'postFix',
      'initScaleAdjustment',
    ],
    setStyleKeys: ['init', 'colorForScale', 'showScale'],
    setEventResizeKeys: ['init', 'showScale', 'initScaleAdjustment'],
  };

  update(options: IPluginOptions) {
    if (this._isFirstInit) {
      this._init(options);
      this._isFirstInit = false;
    }

    const { key } = options;
    const { renderScaleKeys, setStyleKeys, setEventResizeKeys } = this._verifKeysObj;

    if (setStyleKeys.includes(key)) this._setStyleForScale(options);

    if (renderScaleKeys.includes(key)) {
      this._createScale(options);
      this._checkingScaleSize(options);

      if (setEventResizeKeys.includes(key)) this._setEventResize(options);
    }
  }

  private _init(options: IPluginOptions) {
    const { $selector, $elemSlider, $elemScale } = options;

    this._$selector = $selector;
    this._$elemSlider = $elemSlider;
    this._$elemScale = $elemScale;
  }

  // Rendering of the scale of values
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
      const isCustomValue = customValues.length > 0;
      const $fragmentWithScale = $(document.createDocumentFragment());

      let currentValue = minValue;

      for (; currentValue <= maxValue; currentValue += stepSizeValue) {
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

        const position = (valueInScalePoint - minValue) / (maxValue - minValue);
        this._calcScalePointsSize(scalePoint, options);
        $scalePoint.css('left', `${position * 100}%`);
      });

      const hasMissingScalePoints = this._mapSkipScalePoints && this._mapSkipScalePoints.size > 0;

      if (hasMissingScalePoints) this._mapSkipScalePoints.clear();

      this._setEventsScalePoints();
    }
  }

  private _calcScalePointsSize(
    targetScalePoint: HTMLElement,
    options: IPluginOptions & { testWidth?: number | null; testHeight?: number | null },
  ) {
    const { isVertical, testHeight, testWidth } = options;

    if (isVertical) {
      this._scalePointsSize += testHeight ?? targetScalePoint.offsetHeight;
    } else {
      this._scalePointsSize += testWidth ?? targetScalePoint.offsetWidth;
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
   * A method that checks whether all the scale divisions fit on a given slider length.
   * If not, then this method automatically adjusts the scale divisions and hides the extra values
   */
  private _checkingScaleSize(options: IPluginOptions) {
    const { showScale, initScaleAdjustment } = options;

    if (showScale && initScaleAdjustment) {
      const MARGIN_PX = 100;
      const CONTROL_NUM_POINTS = 6;
      const sliderSize = this._$elemSlider.outerWidth() || 0;

      while (this._scalePointsSize + MARGIN_PX > sliderSize) {
        const totalSizeScalePoints = this._scalePointsSize + MARGIN_PX;
        this._skipScalePointsArray = [];
        this._$elemScalePoints = this._$selector.find(
          '.js-meta-slider__scale-point:not(.meta-slider__scale-point_skipped)',
        );

        this._scalePointsSize = 0;
        const numberScalePoints = this._$elemScalePoints.length;

        if (numberScalePoints <= 2) break;

        this._$elemScalePoints.each((index, currentScalePoint) => {
          const firstOrLastIndex = index === 0 || index === numberScalePoints - 1;
          const indexIsOdd = index % 2 !== 0;
          const numberPointsIsOdd = numberScalePoints % 2 !== 0;
          const numberPointsIsEven = numberScalePoints % 2 === 0;
          const numberPointsGreaterThanControl = numberScalePoints > CONTROL_NUM_POINTS;
          const numberPointsLessThanControl = numberScalePoints <= CONTROL_NUM_POINTS;
          const intervalWithoutFirstAndLastIndex =
            !firstOrLastIndex && numberScalePoints <= CONTROL_NUM_POINTS;

          if (indexIsOdd && numberPointsGreaterThanControl) {
            this._setPropForSkipScalePoint(currentScalePoint);
          } else if (numberPointsIsOdd && numberPointsLessThanControl) {
            this._setPropForSkipScalePoint(currentScalePoint);
          } else if (numberPointsIsEven && intervalWithoutFirstAndLastIndex) {
            this._setPropForSkipScalePoint(currentScalePoint);
          }

          if (!currentScalePoint.classList.contains('meta-slider__scale-point_skipped')) {
            this._calcScalePointsSize(currentScalePoint, options);
          }
        });

        this._mapSkipScalePoints.set(totalSizeScalePoints, [...this._skipScalePointsArray]);
      }

      this._checkingSkipScalePointSize(sliderSize, MARGIN_PX, options);
    }
  }

  // Setting properties for skipped scale divisions
  private _setPropForSkipScalePoint(currentScalePoint: HTMLElement) {
    const $currentScalePoint = $(currentScalePoint);
    $currentScalePoint
      .addClass('meta-slider__scale-point_skipped')
      .attr('tabindex', -1)
      .css({ color: 'transparent', borderColor: 'inherit' });

    this._skipScalePointsArray.push($currentScalePoint);
  }

  /**
   * The method tracks the slider size and returns hidden scale divisions,
   * if they already fit on the scale
   */
  private _checkingSkipScalePointSize(sliderSize: number, margin: number, options: IPluginOptions) {
    this._mapSkipScalePoints.forEach((scalePointSkipArray, controlSize) => {
      if (sliderSize > controlSize + margin / 3) {
        scalePointSkipArray.forEach(($scalePoint) => {
          $scalePoint
            .removeAttr('tabindex')
            .removeClass('meta-slider__scale-point_skipped')
            .css({ color: 'inherit', borderColor: '' });

          this._calcScalePointsSize($scalePoint[0], options);
        });

        this._mapSkipScalePoints.delete(controlSize);
      }
    });
  }

  // Event handler that tracks the size of the browser window for the checkingScaleSize() method
  private _setEventResize(options: IPluginOptions) {
    const { showScale, initScaleAdjustment } = options;
    const sliderID = this._$selector.attr('data-id');

    if (showScale && initScaleAdjustment) {
      $(window).on(
        `resize.scale-${sliderID}`,
        makeThrottlingHandler(this._handleWindowResize.bind(this, options), 250),
      );
    } else {
      $(window).off(`resize.scale-${sliderID}`);
    }
  }

  // Tracks the width of the slider
  private _handleWindowResize(options: IPluginOptions) {
    this._checkingScaleSize(options);
  }

  // Event handler for clicks on scale values
  private _setEventsScalePoints() {
    this._$elemScalePoints.on('click.scalePoint', this._handleScalePointClick.bind(this));
  }

  // Gets values when clicking on the slider scale
  private _handleScalePointClick(event: Event & { target: EventTarget }) {
    event.preventDefault();
    const $target = $(event.target);
    const targetValue = Number($target.attr('data-value'));

    this.notify(event, targetValue);
  }
}

export default ViewScale;
